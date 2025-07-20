import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import App from '../../App';

vi.mock('../../api/rickAndMorty', () => ({
  fetchCharacters: vi.fn(() =>
    Promise.resolve({
      results: [
        {
          id: 1,
          name: 'Rick Sanchez',
          species: 'Human',
          gender: 'Male',
          image: 'rick.png',
        },
      ],
      info: { next: null, prev: null },
    })
  ),
  fetchPageData: vi.fn(),
}));

describe('App Component', () => {
  const localStorageMock = {
    getItem: vi.fn(),
    setItem: vi.fn(),
  };

  beforeEach(() => {
    localStorageMock.getItem.mockReset();
    localStorageMock.setItem.mockReset();
    vi.stubGlobal('localStorage', localStorageMock);
  });

  it('loads initial searchTerm from localStorage on mount', async () => {
    localStorageMock.getItem.mockReturnValue('rick');

    render(<App />);

    expect(localStorage.getItem).toHaveBeenCalledWith('search');

    await waitFor(() => {
      expect(screen.getByText(/rick sanchez/i)).toBeInTheDocument();
    });
  });

  it('updates localStorage on new search', async () => {
    localStorageMock.getItem.mockReturnValue('');

    render(<App />);

    const input = screen.getByPlaceholderText(/search for a character/i);
    const button = screen.getByRole('button', { name: /search/i });

    await userEvent.type(input, 'Morty');
    await userEvent.click(button);

    await waitFor(() => {
      expect(localStorage.setItem).toHaveBeenCalledWith('search', 'morty');
    });
  });
});
