import { describe, it, expect } from 'vitest';
import { passwordRules } from './password';

describe('passwordRules', () => {
  it('валидный пароль проходит', () => {
    const result = passwordRules.safeParse('GoodPass1!');
    expect(result.success).toBe(true);
  });

  it('слишком короткий пароль отклоняется', () => {
    const result = passwordRules.safeParse('Aa1!');
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.issues[0].message).toBe('Minimum 8 chars');
    }
  });

  it('пароль без цифры отклоняется', () => {
    const result = passwordRules.safeParse('Password!');
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(
        result.error.issues.some((i) => i.message === 'At least one digit')
      ).toBe(true);
    }
  });

  it('пароль без маленькой буквы отклоняется', () => {
    const result = passwordRules.safeParse('PASSWORD1!');
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(
        result.error.issues.some((i) => i.message === 'At least one lowercase')
      ).toBe(true);
    }
  });

  it('пароль без большой буквы отклоняется', () => {
    const result = passwordRules.safeParse('password1!');
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(
        result.error.issues.some((i) => i.message === 'At least one uppercase')
      ).toBe(true);
    }
  });

  it('пароль без спецсимвола отклоняется', () => {
    const result = passwordRules.safeParse('Password1');
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(
        result.error.issues.some((i) => i.message === 'At least one special')
      ).toBe(true);
    }
  });
});
