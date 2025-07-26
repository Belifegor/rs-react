import { describe, it, expect, vi, beforeEach } from 'vitest';
import type { MockedFunction } from 'vitest';
import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import App from '../../Layout';
import { fetchCharacters, fetchPageData } from '../../api/rickAndMorty';
import { MemoryRouter } from 'react-router';

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

    render(
      <MemoryRouter>
        <App />
      </MemoryRouter>
    );

    expect(localStorage.getItem).toHaveBeenCalledWith('search');

    await waitFor(() => {
      expect(screen.getByText(/rick sanchez/i)).toBeInTheDocument();
    });
  });

  it('updates localStorage on new search', async () => {
    localStorageMock.getItem.mockReturnValue('');

    render(
      <MemoryRouter>
        <App />
      </MemoryRouter>
    );

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

    render(
      <MemoryRouter>
        <App />
      </MemoryRouter>
    );
    expect(screen.getByText(/loading/i)).toBeInTheDocument();

    await waitFor(() =>
      expect(screen.queryByText(/loading/i)).not.toBeInTheDocument()
    );
  });

  it('displays error message on fetch failure', async () => {
    (
      fetchCharacters as MockedFunction<typeof fetchCharacters>
    ).mockRejectedValueOnce(new Error('Character not found'));

    render(
      <MemoryRouter>
        <App />
      </MemoryRouter>
    );

    await waitFor(() =>
      expect(
        screen.getByText(/error: character not found/i)
      ).toBeInTheDocument()
    );
  });

  it('renders page buttons and handles page change on click', async () => {
    vi.mocked(fetchCharacters).mockResolvedValueOnce({
      results: [
        {
          id: 1,
          name: 'Rick Sanchez',
          image: 'rick.png',
          status: 'Alive',
          species: 'Human',
          gender: 'Male',
        },
      ],
      info: {
        pages: 3,
        count: 60,
        next: 'next-url',
        prev: null,
      },
    });

    render(
      <MemoryRouter initialEntries={['/?page=1']}>
        <App />
      </MemoryRouter>
    );

    const page2Button = await screen.findByRole('button', { name: '2' });
    expect(page2Button).toBeInTheDocument();

    fireEvent.click(page2Button);
  });
});
