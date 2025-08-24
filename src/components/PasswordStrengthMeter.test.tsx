import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';

const getPropsMock = vi.fn();
vi.mock('../utils/passwordUtils', () => ({
  __esModule: true,
  getPasswordStrengthProps: (score: number) => getPropsMock(score),
}));

import { PasswordStrengthMeter } from './PasswordStrengthMeter';

beforeEach(() => {
  getPropsMock.mockReset();
});

describe('PasswordStrengthMeter', () => {
  it('не рендерит ничего при score=0', () => {
    const { container } = render(<PasswordStrengthMeter score={0} />);
    expect(container.firstChild).toBeNull();
    expect(getPropsMock).not.toHaveBeenCalled();
  });

  it('рендерит label и применяет цвет при score>0', () => {
    getPropsMock.mockReturnValue({ label: 'Сильный', color: 'rgb(0, 128, 0)' });
    render(<PasswordStrengthMeter score={3} />);

    const el = screen.getByText(/Сложность: Сильный/);
    expect(el).toBeInTheDocument();
    expect(el).toHaveStyle({ color: 'rgb(0, 128, 0)', fontSize: '12px' });
    expect(getPropsMock).toHaveBeenCalledWith(3);
  });

  it('корректно подставляет другой label/color', () => {
    getPropsMock.mockReturnValue({ label: 'Слабый', color: 'rgb(255, 0, 0)' });
    render(<PasswordStrengthMeter score={1} />);
    const el = screen.getByText(/Сложность: Слабый/);
    expect(el).toHaveStyle({ color: 'rgb(255, 0, 0)' });
  });
});
