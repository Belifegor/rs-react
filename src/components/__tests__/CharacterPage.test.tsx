vi.mock('../../api/rickAndMorty');

import { describe, it, expect, vi, beforeEach } from 'vitest';
import type { MockedFunction } from 'vitest';
import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import CharacterPage from '../../pages/CharacterPage';
import { fetchCharacters, fetchPageData } from '../../api/rickAndMorty';
import { MemoryRouter } from 'react-router-dom';

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

  it('shows loading indicator during fetch', async () => {
    (
      fetchCharacters as MockedFunction<typeof fetchCharacters>
    ).mockImplementationOnce(() => {
      return new Promise((resolve) => {
        setTimeout(() => {
          resolve({
            info: { pages: 1, count: 1, next: null, prev: null },
            results: [],
          });
        }, 100);
      });
    });

    render(
      <MemoryRouter initialEntries={['/1']}>
        <CharacterPage />
      </MemoryRouter>
    );

    const searchInput = screen.getByPlaceholderText(
      'Search for a character...'
    );
    fireEvent.change(searchInput, { target: { value: 'test' } });
    const searchButton = screen.getByText('Search');
    fireEvent.click(searchButton);

    expect(screen.getByText('Loading...')).toBeInTheDocument();

    await waitFor(() => {
      expect(screen.queryByText('Loading...')).not.toBeInTheDocument();
    });
  });

  it('displays error message on fetch failure', async () => {
    (
      fetchCharacters as MockedFunction<typeof fetchCharacters>
    ).mockRejectedValueOnce(new Error('Character not found'));

    render(
      <MemoryRouter initialEntries={['/1']}>
        <CharacterPage />
      </MemoryRouter>
    );

    const searchInput = screen.getByPlaceholderText(
      'Search for a character...'
    );
    fireEvent.change(searchInput, { target: { value: 'test' } });

    const form = searchInput.closest('form');
    if (form) {
      fireEvent.submit(form);
    }

    await waitFor(() => {
      expect(
        screen.getByText(/error: no characters found/i)
      ).toBeInTheDocument();
    });
  });

  it('renders page buttons and handles page change on click', async () => {
    (
      fetchCharacters as MockedFunction<typeof fetchCharacters>
    ).mockResolvedValueOnce({
      info: { pages: 3, count: 30, next: null, prev: null },
      results: [
        {
          id: 1,
          name: 'Rick Sanchez',
          status: 'Alive',
          species: 'Human',
          gender: 'Male',
          image: 'rick-image.jpg',
        },
        {
          id: 2,
          name: 'Morty Smith',
          status: 'Alive',
          species: 'Human',
          gender: 'Male',
          image: 'morty-image.jpg',
        },
      ],
    });

    render(
      <MemoryRouter initialEntries={['/1']}>
        <CharacterPage />
      </MemoryRouter>
    );

    const searchInput = screen.getByPlaceholderText(
      'Search for a character...'
    );
    fireEvent.change(searchInput, { target: { value: 'rick' } });
    const searchButton = screen.getByText('Search');
    fireEvent.click(searchButton);

    await waitFor(() => {
      expect(screen.getByText('Rick Sanchez')).toBeInTheDocument();
    });

    await waitFor(() => {
      const pageButton = screen.getByRole('button', { name: '2' });
      expect(pageButton).toBeInTheDocument();
    });

    const pageButton = screen.getByRole('button', { name: '2' });
    fireEvent.click(pageButton);
  });
});
