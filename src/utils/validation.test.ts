import { describe, it, expect } from 'vitest';
import { schema } from './validation';

function validInput() {
  return {
    name: 'John',
    age: '22',
    email: 'Test@Mail.COM',
    password: 'Aa1!aaaa',
    confirmPassword: 'Aa1!aaaa',
    gender: 'male' as const,
    acceptedTnC: true as const,
    country: 'Moldova',
    imageFile: undefined,
  };
}

describe('schema (текущая реализация)', () => {
  it('валидный набор проходит и нормализуется', () => {
    const res = schema.safeParse(validInput());
    expect(res.success).toBe(true);
    if (res.success) {
      expect(res.data.age).toBe(22);
      expect(res.data.email).toBe('test@mail.com');
    }
  });

  it('отрезает лишние поля через .strip()', () => {
    const input = { ...validInput(), extra: 'trash' };
    const res = schema.safeParse(input);

    expect(res.success).toBe(true);
    if (res.success) {
      expect(Object.keys(res.data)).not.toContain('extra');
    }
  });

  it('валидирует совпадение паролей', () => {
    const input = { ...validInput(), confirmPassword: 'not-same' };
    const res = schema.safeParse(input);
    expect(res.success).toBe(false);
    if (!res.success) {
      const paths = res.error.issues.map((i) => i.path.join('.'));
      expect(paths).toContain('confirmPassword');
      expect(
        res.error.issues.some((i) => i.message === 'Passwords must match')
      ).toBe(true);
    }
  });

  it('валидирует границы возраста: минимум 12, максимум 100', () => {
    expect(schema.safeParse({ ...validInput(), age: '11' }).success).toBe(
      false
    );
    expect(schema.safeParse({ ...validInput(), age: '101' }).success).toBe(
      false
    );

    expect(schema.safeParse({ ...validInput(), age: '12' }).success).toBe(true);
    expect(schema.safeParse({ ...validInput(), age: '100' }).success).toBe(
      true
    );
  });

  it('требует принятия T&C (literal true)', () => {
    const res = schema.safeParse({
      ...validInput(),
      acceptedTnC: false as unknown as true,
    });
    expect(res.success).toBe(false);
    if (!res.success) {
      expect(
        res.error.issues.some((i) => i.message === 'You must accept T&C')
      ).toBe(true);
    }
  });

  it('валидирует имя: первая буква заглавная латиницей (твоя regex)', () => {
    expect(schema.safeParse({ ...validInput(), name: 'john' }).success).toBe(
      false
    );

    expect(schema.safeParse({ ...validInput(), name: '1ohn' }).success).toBe(
      false
    );

    expect(schema.safeParse({ ...validInput(), name: 'Иван' }).success).toBe(
      false
    );

    expect(
      schema.safeParse({ ...validInput(), name: 'John Smith' }).success
    ).toBe(true);
  });

  it('валидирует страну как непустую строку после trim', () => {
    expect(schema.safeParse({ ...validInput(), country: '   ' }).success).toBe(
      false
    );
    expect(schema.safeParse({ ...validInput(), country: '' }).success).toBe(
      false
    );
    expect(
      schema.safeParse({ ...validInput(), country: 'Moldova' }).success
    ).toBe(true);
  });

  it('email должен быть валидным и приводится к нижнему регистру', () => {
    const ok = schema.safeParse({ ...validInput(), email: 'USER@EXAMPLE.COM' });
    expect(ok.success).toBe(true);
    if (ok.success) {
      expect(ok.data.email).toBe('user@example.com');
    }

    const bad = schema.safeParse({ ...validInput(), email: 'not-an-email' });
    expect(bad.success).toBe(false);
  });

  it('imageFile опционален и не ломает валидацию', () => {
    expect(
      schema.safeParse({ ...validInput(), imageFile: undefined }).success
    ).toBe(true);
  });
});
