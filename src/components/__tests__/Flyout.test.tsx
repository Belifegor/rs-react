import { render, screen, fireEvent } from '@testing-library/react';
import Flyout from '../Flyout';
import type { Character } from '../../types/types';
import { vi, describe, it, expect, beforeEach } from 'vitest';

const unselectAllMock = vi.fn();
const store = { selected: [] as string[], unselectAll: unselectAllMock };

vi.mock('../../store/store', () => ({
  useStore: <T,>(sel: (s: typeof store) => T): T => sel(store),
}));

beforeEach(() => {
  store.selected.length = 0;
  unselectAllMock.mockClear();
  (
    globalThis.URL as unknown as { createObjectURL?: () => string }
  ).createObjectURL = () => 'blob:x';
});

const items: Character[] = [
  {
    id: 1,
    name: 'Rick',
    status: 'Alive',
    gender: 'Male',
    species: '',
    image: '',
  },
];

describe('Flyout statements smoke', () => {
  it('returns null when nothing selected', () => {
    render(<Flyout items={items} />);
    expect(document.body.innerHTML).toBe('<div></div>');
  });

  it('renders and calls unselectAll', () => {
    store.selected.push('1');
    render(<Flyout items={items} />);

    expect(screen.getByText('1 item selected')).toBeInTheDocument();

    fireEvent.click(screen.getByText(/Unselect all/i));
    expect(unselectAllMock).toHaveBeenCalledTimes(1);
  });
});
