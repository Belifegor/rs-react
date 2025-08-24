import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';

import { Field } from './Field';

vi.mock('./FieldError', () => ({
  __esModule: true,
  FieldError: ({ msg }: { msg?: string }) =>
    msg ? <div role="alert">{msg}</div> : null,
}));

describe('Field', () => {
  it('рендерит label и children', () => {
    render(
      <Field label="Имя" htmlFor="name-field">
        <input id="name-field" type="text" />
      </Field>
    );

    const label = screen.getByText('Имя');
    expect(label).toHaveAttribute('for', 'name-field');

    const input = screen.getByRole('textbox');
    expect(input).toBeInTheDocument();
  });

  it('отображает ошибку, если error задан', () => {
    render(
      <Field label="Email" htmlFor="email">
        <input id="email" type="email" />
      </Field>
    );

    expect(screen.queryByRole('alert')).toBeNull();

    render(
      <Field label="Email" htmlFor="email" error="Неверный email">
        <input id="email" type="email" />
      </Field>
    );

    expect(screen.getByRole('alert')).toHaveTextContent('Неверный email');
  });
});
