import React from 'react';
import {
  describe,
  it,
  expect,
  vi,
  beforeAll,
  afterAll,
  beforeEach,
} from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

const h = vi.hoisted(() => ({
  addEntry: vi.fn(),
  fileToBase64: vi.fn(
    async (): Promise<string> => 'data:image/png;base64,FAKE'
  ),
}));

type CountryProps = {
  value: string;
  onChange: (v: string) => void;
  inputId?: string;
  placeholder?: string;
};
vi.mock('../forms/CountryAutocomplete', () => ({
  __esModule: true,
  default: ({ value, onChange, inputId, placeholder }: CountryProps) => (
    <input
      id={inputId}
      aria-label="country-autocomplete"
      value={value}
      placeholder={placeholder}
      onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
        onChange(e.target.value)
      }
    />
  ),
}));

vi.mock('../PasswordStrengthMeter', () => ({
  __esModule: true,
  PasswordStrengthMeter: ({ score }: { score: number }) => (
    <div data-testid="pwd-score">score:{score}</div>
  ),
}));

vi.mock('../../utils/passwordStrength', () => ({
  __esModule: true,
  calculatePasswordStrength: (pwd: string) =>
    Math.min(4, Math.floor((pwd ?? '').length / 3)),
}));

vi.mock('../../utils/fileToBase64', () => ({
  __esModule: true,
  fileToBase64: h.fileToBase64,
}));

vi.mock('../ui/FieldError', () => ({
  __esModule: true,
  FieldError: ({ msg }: { msg?: string }) =>
    msg ? <div role="alert">{msg}</div> : null,
}));

vi.mock('../ui/Field', () => ({
  __esModule: true,
  Field: ({
    label,
    htmlFor,
    error,
    children,
  }: {
    label: string;
    htmlFor?: string;
    error?: string;
    children: React.ReactNode;
  }) => (
    <div>
      <label htmlFor={htmlFor}>{label}</label>
      {children}
      {error ? <div role="alert">{error}</div> : null}
    </div>
  ),
}));

vi.mock('../ui/formClasses', () => ({
  __esModule: true,
  inputClass: 'input',
  selectClass: 'select',
  fileClass: 'file',
  checkboxClass: 'checkbox',
}));
vi.mock('../../store/useFormsStore', () => ({
  __esModule: true,
  useFormsStore: <T,>(sel: (s: { addEntry: typeof h.addEntry }) => T) =>
    sel({ addEntry: h.addEntry }),
}));
vi.mock('@hookform/resolvers/zod', () => ({
  __esModule: true,
  zodResolver: () => async (values: Record<string, unknown>) => {
    const errs: Record<string, { message: string }> = {};
    if (!values.name) errs.name = { message: 'Введите имя' };
    if (typeof values.email !== 'string' || !values.email.includes('@'))
      errs.email = { message: 'Неверный email' };
    if (typeof values.password !== 'string' || values.password.length < 6)
      errs.password = { message: 'Пароль слишком короткий' };
    if (values.confirmPassword !== values.password)
      errs.confirmPassword = { message: 'Пароли не совпадают' };
    if (!values.gender) errs.gender = { message: 'Выберите пол' };
    if (!values.country) errs.country = { message: 'Укажите страну' };
    if (!values.acceptedTnC) errs.acceptedTnC = { message: 'Нужно согласие' };
    return {
      values: Object.keys(errs).length ? {} : values,
      errors: Object.fromEntries(
        Object.entries(errs).map(([k, v]) => [
          k,
          { type: 'manual', message: v.message },
        ])
      ),
    };
  },
}));
vi.mock('../../utils/validation', () => ({ __esModule: true, schema: {} }));

const realCrypto = globalThis.crypto;
beforeAll(() => {
  Object.defineProperty(globalThis, 'crypto', {
    configurable: true,
    value: {
      ...realCrypto,
      randomUUID: (): `${string}-${string}-${string}-${string}-${string}` =>
        '123e4567-e89b-12d3-a456-426614174000',
    } as Crypto,
  });
});
afterAll(() => {
  Object.defineProperty(globalThis, 'crypto', {
    configurable: true,
    value: realCrypto,
  });
});
beforeEach(() => vi.clearAllMocks());

// SUT
import { HookForm } from './HookForm';

describe('HookForm (short)', () => {
  it('валидация на onChange: вводим некорректный email и видим alert', async () => {
    const user = userEvent.setup();
    render(<HookForm />);

    expect(
      screen.getByRole('button', { name: /зарегистрироваться/i })
    ).toBeDisabled();

    await user.type(screen.getByLabelText('Email'), 'bad'); // нет '@' -> ошибка
    expect(await screen.findByRole('alert')).toHaveTextContent(
      /неверный email/i
    );
  });

  it('индикатор силы пароля меняется при вводе', async () => {
    const user = userEvent.setup();
    render(<HookForm />);

    const pwd = screen.getByLabelText('Пароль');
    expect(screen.getByTestId('pwd-score')).toHaveTextContent('score:0');
    await user.type(pwd, 'abc123');
    expect(screen.getByTestId('pwd-score')).toHaveTextContent('score:2');
  });

  it('валидный сабмит: видим "Отправка..." на короткое время, затем addEntry и onSuccess', async () => {
    const user = userEvent.setup();
    const onSuccess = vi.fn();

    h.fileToBase64.mockImplementationOnce(
      () =>
        new Promise<string>((resolve) => {
          setTimeout(() => resolve('data:image/png;base64,SLOW_FAKE'), 20);
        })
    );

    render(<HookForm onSuccess={onSuccess} />);

    await user.type(screen.getByLabelText('Имя'), 'Alex');
    await user.type(screen.getByLabelText('Email'), 'alex@example.com');
    await user.type(screen.getByLabelText('Пароль'), 'secret1');
    await user.type(screen.getByLabelText('Подтвердите пароль'), 'secret1');
    await user.selectOptions(screen.getByLabelText('Пол'), 'male');
    await user.type(screen.getByLabelText('country-autocomplete'), 'Moldova');
    await user.click(screen.getByRole('checkbox'));
    await user.upload(
      screen.getByLabelText('Изображение профиля'),
      new File([new Uint8Array([1])], 'a.png', { type: 'image/png' })
    );

    const submit = screen.getByRole('button', { name: /зарегистрироваться/i });
    expect(submit).toBeEnabled();
    await user.click(submit);

    await waitFor(() => {
      expect(submit).toBeDisabled();
      expect(submit).toHaveTextContent(/отправка/i);
    });

    await waitFor(() => {
      expect(h.addEntry).toHaveBeenCalledTimes(1);
      expect(onSuccess).toHaveBeenCalledTimes(1);
    });

    await waitFor(() => {
      expect(
        screen.getByRole('button', { name: /зарегистрироваться/i })
      ).toBeEnabled();
    });
  });
});
