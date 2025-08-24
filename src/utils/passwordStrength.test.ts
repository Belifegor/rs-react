import { describe, it, expect } from 'vitest';
import { calculatePasswordStrength } from './passwordStrength';

describe('calculatePasswordStrength', () => {
  it('возвращает 0 для пустой строки', () => {
    expect(calculatePasswordStrength('')).toBe(0);
  });

  it('учёт длины и классов символов — базовые кейсы', () => {
    expect(calculatePasswordStrength('abcdefg')).toBe(1);

    expect(calculatePasswordStrength('abcdefgh')).toBe(2);

    expect(calculatePasswordStrength('abcdefghijkl')).toBe(3);
  });

  it('учитывает цифры, нижний и верхний регистр', () => {
    expect(calculatePasswordStrength('abc123')).toBe(2);

    expect(calculatePasswordStrength('Abc123')).toBe(3);
  });

  it('учитывает спецсимволы', () => {
    expect(calculatePasswordStrength('1!')).toBe(2);
  });

  it('сильный пароль получает высокий балл', () => {
    const score = calculatePasswordStrength('GoodPass123!');
    expect(score).toBeGreaterThanOrEqual(5);
  });
});
