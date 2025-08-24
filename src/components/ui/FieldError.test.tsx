import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';

import { FieldError } from './FieldError';

describe('FieldError', () => {
  it('по умолчанию рендерит placeholder и скрыт через opacity-0', () => {
    render(<FieldError />);

    const el = screen.getByText('placeholder');
    expect(el).toHaveAttribute('aria-live', 'polite');
    expect(el).toHaveClass('opacity-0');
  });

  it('при переданном msg отображает сообщение и применяет классы ошибки', () => {
    render(<FieldError msg="Ошибка валидации" />);

    const el = screen.getByText('Ошибка валидации');
    expect(el).toHaveClass('text-rose-400');
    expect(el).toHaveClass('opacity-100');
  });
});
