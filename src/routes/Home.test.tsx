// src/routes/Home.test.tsx
import React from 'react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import Home from './Home';

const h = vi.hoisted(() => {
  const clearHighlight = vi.fn();
  const entries = [
    {
      id: '1',
      name: 'Alice',
      email: 'alice@example.com',
      country: 'Moldova',
      gender: 'female',
      age: 25,
      createdAt: 1700000000000,
      source: 'rhf',
      imageBase64: 'data:image/png;base64,AAA',
    },
    {
      id: '2',
      name: 'Bob',
      email: 'bob@example.com',
      country: 'Romania',
      gender: 'male',
      age: 30,
      createdAt: 1700000100000,
      source: 'uncontrolled',
      imageBase64: undefined,
    },
  ];
  const state = {
    entries,
    lastId: '2' as string | null,
    clearHighlight,
  };
  return { state };
});

vi.mock('../store/selectors', () => ({
  __esModule: true,
  selectEntries: (s: { entries: unknown[] }) => s.entries,
  selectLastCreatedId: (s: { lastId: string | null }) => s.lastId,
}));

vi.mock('../store/useFormsStore', () => {
  const useFormsStore = <T,>(sel: (s: typeof h.state) => T) => sel(h.state);
  (useFormsStore as unknown as { getState: () => typeof h.state }).getState =
    () => h.state;
  return { __esModule: true, useFormsStore };
});

type ModalProps = {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
};
vi.mock('../components/modal/Modal', () => ({
  __esModule: true,
  default: ({ isOpen, onClose, title, children }: ModalProps) =>
    isOpen ? (
      <div role="dialog" aria-modal="true" aria-labelledby="dlg-title">
        {title ? <h2 id="dlg-title">{title}</h2> : null}
        <button onClick={onClose}>Close</button>
        {children}
      </div>
    ) : null,
}));

vi.mock('../components/forms/UncontrolledForm', () => ({
  __esModule: true,
  default: ({ onSuccess }: { onSuccess?: () => void }) => (
    <button onClick={() => onSuccess && onSuccess()}>
      Submit Uncontrolled
    </button>
  ),
}));

vi.mock('../components/forms/HookForm', () => ({
  __esModule: true,
  HookForm: ({ onSuccess }: { onSuccess?: () => void }) => (
    <button onClick={() => onSuccess && onSuccess()}>Submit RHF</button>
  ),
}));

beforeEach(() => {
  h.state.clearHighlight.mockClear();
});

describe('Home', () => {
  it('открывает и закрывает модалку Uncontrolled по кнопке и onSuccess', async () => {
    render(<Home />);

    expect(
      screen.queryByRole('dialog', { name: /uncontrolled form/i })
    ).toBeNull();

    fireEvent.click(screen.getByRole('button', { name: /open uncontrolled/i }));

    expect(
      await screen.findByRole('dialog', { name: /uncontrolled form/i })
    ).toBeInTheDocument();

    fireEvent.click(
      screen.getByRole('button', { name: /submit uncontrolled/i })
    );

    expect(
      screen.queryByRole('dialog', { name: /uncontrolled form/i })
    ).toBeNull();
  });

  it('открывает и закрывает модалку RHF по кнопке и onSuccess', async () => {
    render(<Home />);

    fireEvent.click(
      screen.getByRole('button', { name: /open react hook form/i })
    );

    expect(
      await screen.findByRole('dialog', { name: /react hook form/i })
    ).toBeInTheDocument();

    fireEvent.click(screen.getByRole('button', { name: /submit rhf/i }));

    expect(
      screen.queryByRole('dialog', { name: /react hook form/i })
    ).toBeNull();
  });

  it('рендерит карточки из стора, подсвечивает новую и показывает картинку', () => {
    render(<Home />);

    expect(screen.getAllByText(/source:/i).length).toBe(2);

    expect(screen.getByRole('img', { name: 'Alice' })).toBeInTheDocument();

    const cards = screen
      .getAllByText(/source:/i)
      .map((el) => el.closest('div.rounded-2xl'));
    const hasNew = cards.some((c) => c?.className.includes('new-card'));
    const hasNeutral = cards.some((c) =>
      c?.className.includes('border-neutral-800')
    );
    expect(hasNew).toBe(true);
    expect(hasNeutral).toBe(true);
  });

  it('через 2500мс вызывает clearHighlight', () => {
    vi.useFakeTimers();
    render(<Home />);

    expect(h.state.clearHighlight).not.toHaveBeenCalled();

    vi.advanceTimersByTime(2500);

    expect(h.state.clearHighlight).toHaveBeenCalledTimes(1);

    vi.useRealTimers();
  });
});
