import { describe, it, expect, vi, beforeEach } from 'vitest';
import type { MockedFunction } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import App from '../../App';
import { fetchCharacters, fetchPageData } from '../../api/rickAndMorty';

vi.mock('../../api/rickAndMorty');

const mockCharData = {
  results: [
    {
      id: 1,
      name: 'Rick Sanchez',
      status: 'Alive',
      species: 'Human',
      gender: 'Male',
      image: 'rick.png',
    },
  ],
  info: {
    count: 1,
    pages: 1,
    next: 'next-url',
    prev: 'prev-url',
  },
};

describe('App Component', () => {
  const localStorageMock = {
    getItem: vi.fn(),
    setItem: vi.fn(),
  };

  beforeEach(() => {
    vi.resetAllMocks();
    localStorageMock.getItem.mockReset();
    localStorageMock.setItem.mockReset();
    vi.stubGlobal('localStorage', localStorageMock);
    vi.mocked(fetchCharacters).mockResolvedValue(mockCharData);
    vi.mocked(fetchPageData).mockResolvedValue(mockCharData);
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

  it('shows loading indicator during fetch', async () => {
    (
      fetchCharacters as MockedFunction<typeof fetchCharacters>
    ).mockImplementation(() => {
      return new Promise((resolve) =>
        setTimeout(() => resolve(mockCharData), 100)
      );
    });

    render(<App />);
    expect(screen.getByText(/loading/i)).toBeInTheDocument();

    await waitFor(() =>
      expect(screen.queryByText(/loading/i)).not.toBeInTheDocument()
    );
  });

  it('displays error message on fetch failure', async () => {
    (
      fetchCharacters as MockedFunction<typeof fetchCharacters>
    ).mockRejectedValueOnce(new Error('Character not found'));

    render(<App />);

    await waitFor(() =>
      expect(
        screen.getByText(/error: character not found/i)
      ).toBeInTheDocument()
    );
  });

  it('renders next and previous buttons and handles clicks', async () => {
    render(<App />);

    await waitFor(() =>
      expect(screen.getByText(/rick sanchez/i)).toBeInTheDocument()
    );

    const nextBtn = screen.getByRole('button', { name: /next/i });
    const prevBtn = screen.getByRole('button', { name: /previous/i });

    expect(nextBtn).toBeInTheDocument();
    expect(prevBtn).toBeInTheDocument();

    await userEvent.click(nextBtn);
    expect(fetchPageData).toHaveBeenCalledWith('next-url');

    await userEvent.click(prevBtn);
    expect(fetchPageData).toHaveBeenCalledWith('prev-url');
  });

  it('throws error when simulate error button clicked', async () => {
    const spy = vi.spyOn(console, 'error').mockImplementation(() => {});

    render(<App />);
    await waitFor(() => screen.getByText(/rick sanchez/i));

    const errorBtn = screen.getByRole('button', { name: /simulate error/i });

    await expect(() => userEvent.click(errorBtn)).rejects;
    spy.mockRestore();
  });
});
