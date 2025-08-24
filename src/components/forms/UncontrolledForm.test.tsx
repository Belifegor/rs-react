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

vi.mock('../../utils/validation', () => ({
  __esModule: true,
  schema: {
    safeParse: (values: Record<string, unknown>) => {
      const errs: Record<string, { message: string }> = {};
      const name = String(values.name ?? '');
      const email = String(values.email ?? '');
      const pwd = String(values.password ?? '');
      const cpwd = String(values.confirmPassword ?? '');
      const gender = String(values.gender ?? '');
      const country = String(values.country ?? '');
      const tnc = Boolean(values.acceptedTnC);

      if (!name) errs.name = { message: 'Введите имя' };
      if (!email.includes('@')) errs.email = { message: 'Неверный email' };
      if (pwd.length < 6)
        errs.password = { message: 'Пароль слишком короткий' };
      if (cpwd !== pwd)
        errs.confirmPassword = { message: 'Пароли не совпадают' };
      if (!gender) errs.gender = { message: 'Выберите пол' };
      if (!country) errs.country = { message: 'Укажите страну' };
      if (!tnc) errs.acceptedTnC = { message: 'Нужно согласие' };

      if (Object.keys(errs).length) {
        return {
          success: false as const,
          error: {
            flatten: () => ({
              fieldErrors: Object.fromEntries(
                Object.entries(errs).map(([k, v]) => [k, [v.message]])
              ) as Record<string, string[]>,
            }),
          },
        };
      }

      const imageFile = values.imageFile as FileList | undefined;

      return {
        success: true as const,
        data: {
          name,
          age: values.age,
          email,
          password: pwd,
          confirmPassword: cpwd,
          gender,
          acceptedTnC: tnc,
          country,
          imageFile,
        },
      };
    },
  },
}));

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

import UncontrolledForm from './UncontrolledForm';

describe('UncontrolledForm (short)', () => {
  it('валидация: при пустых полях отображаются ошибки и сабмит не проходит', async () => {
    const user = userEvent.setup();
    render(<UncontrolledForm />);

    const submit = screen.getByRole('button', { name: /зарегистрироваться/i });
    expect(submit).toBeEnabled();

    await user.click(submit);

    const alerts = await screen.findAllByRole('alert');
    expect(alerts.length).toBeGreaterThanOrEqual(3);
    expect(h.addEntry).not.toHaveBeenCalled();
  });

  it('индикатор силы пароля обновляется при вводе', async () => {
    const user = userEvent.setup();
    render(<UncontrolledForm />);

    const pwd = screen.getByLabelText('Пароль');
    expect(screen.getByTestId('pwd-score')).toHaveTextContent('score:0');

    await user.type(pwd, 'abc123');
    expect(screen.getByTestId('pwd-score')).toHaveTextContent('score:2');
  });

  it('валидный сабмит: показывает "Отправка...", конвертит файл, вызывает addEntry и onSuccess', async () => {
    const user = userEvent.setup();
    const onSuccess = vi.fn();

    h.fileToBase64.mockImplementationOnce(
      () =>
        new Promise<string>((resolve) => {
          setTimeout(() => resolve('data:image/png;base64,SLOW_FAKE'), 20);
        })
    );

    render(<UncontrolledForm onSuccess={onSuccess} />);

    await user.type(screen.getByLabelText('Имя'), 'Alex');
    await user.type(screen.getByLabelText('Email'), 'alex@example.com');
    await user.type(screen.getByLabelText('Пароль'), 'secret1');
    await user.type(screen.getByLabelText('Подтвердите пароль'), 'secret1');
    await user.selectOptions(screen.getByLabelText('Пол'), 'male');
    await user.type(screen.getByLabelText('country-autocomplete'), 'Moldova');
    await user.click(screen.getByLabelText('Я принимаю Условия и Положения'));
    await user.upload(
      screen.getByLabelText('Изображение профиля (до 3MB)'),
      new File([new Uint8Array([1])], 'a.png', { type: 'image/png' })
    );

    const submit = screen.getByRole('button', { name: /зарегистрироваться/i });
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

    const callArg = h.addEntry.mock.calls[0]?.[0] as {
      id: string;
      source: string;
      imageBase64?: string;
      name: string;
      email: string;
      gender: string;
      acceptedTnC: boolean;
      country: string;
      createdAt: number;
    };
    expect(callArg).toMatchObject({
      id: '123e4567-e89b-12d3-a456-426614174000',
      source: 'uncontrolled',
      name: 'Alex',
      email: 'alex@example.com',
      gender: 'male',
      acceptedTnC: true,
      country: 'Moldova',
    });
    expect(typeof callArg.createdAt).toBe('number');
    expect(callArg.imageBase64).toBeDefined();
  });
});
