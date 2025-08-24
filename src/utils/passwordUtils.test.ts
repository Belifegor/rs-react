import { describe, it, expect } from 'vitest';
import { getPasswordStrengthProps } from './passwordUtils';

describe('getPasswordStrengthProps', () => {
  it("возвращает 'Очень слабый' при score <= 1", () => {
    expect(getPasswordStrengthProps(0)).toEqual({
      label: 'Очень слабый',
      color: '#e74c3c',
    });
    expect(getPasswordStrengthProps(1)).toEqual({
      label: 'Очень слабый',
      color: '#e74c3c',
    });
  });

  it("возвращает 'Слабый' при score === 2", () => {
    expect(getPasswordStrengthProps(2)).toEqual({
      label: 'Слабый',
      color: '#f39c12',
    });
  });

  it("возвращает 'Средний' при score === 3", () => {
    expect(getPasswordStrengthProps(3)).toEqual({
      label: 'Средний',
      color: '#f1c40f',
    });
  });

  it("возвращает 'Сильный' при score >= 4", () => {
    expect(getPasswordStrengthProps(4)).toEqual({
      label: 'Сильный',
      color: '#2ecc71',
    });
    expect(getPasswordStrengthProps(10)).toEqual({
      label: 'Сильный',
      color: '#2ecc71',
    });
  });

  it('возвращает пустую подпись и transparent цвет по умолчанию', () => {
    expect(getPasswordStrengthProps(NaN)).toEqual({
      label: '',
      color: 'transparent',
    });
  });
});
