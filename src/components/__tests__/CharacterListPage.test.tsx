vi.mock('../../api/api', () => ({
  fetchCharacters: vi.fn(),
  fetchPageData: vi.fn(),
}));

import { describe, it, expect, vi, beforeEach } from 'vitest';
import type { MockedFunction } from 'vitest';
import { screen, waitFor, fireEvent } from '@testing-library/react';
import CharacterPage from '../../pages/CharacterListPage';
import { fetchCharacters, fetchPageData } from '../../lib/api';
import { renderWithClient } from './utils/renderWithClient';
import type { RMResponse } from '../../types/types';

const mockCharData: RMResponse = {
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
  const localStorageMock = { getItem: vi.fn(), setItem: vi.fn() };

  beforeEach(() => {
    vi.resetAllMocks();
    localStorageMock.getItem.mockReset();
    localStorageMock.setItem.mockReset();
    vi.stubGlobal('localStorage', localStorageMock);

    (
      fetchCharacters as MockedFunction<typeof fetchCharacters>
    ).mockResolvedValue(mockCharData);
    (fetchPageData as MockedFunction<typeof fetchPageData>).mockResolvedValue(
      mockCharData
    );
  });

  it('shows loading indicator during fetch', async () => {
    (
      fetchCharacters as MockedFunction<typeof fetchCharacters>
    ).mockImplementationOnce(
      () =>
        new Promise<RMResponse>((resolve) => {
          setTimeout(() => {
            resolve({
              info: { pages: 1, count: 1, next: null, prev: null },
              results: [],
            } as RMResponse);
          }, 100);
        })
    );

    renderWithClient(<CharacterPage />, { route: '/1' });

    const searchInput = screen.getByPlaceholderText(
      'Search for a character...'
    );
    fireEvent.change(searchInput, { target: { value: 'test' } });
    fireEvent.click(screen.getByText('Search'));

    expect(screen.getByRole('status')).toBeInTheDocument();

    await waitFor(() => {
      expect(screen.queryByRole('status')).not.toBeInTheDocument();
    });
  });

  it('renders characters when fetch is successful', async () => {
    renderWithClient(<CharacterPage />, { route: '/1' });

    const searchInput = screen.getByPlaceholderText(
      'Search for a character...'
    );
    fireEvent.change(searchInput, { target: { value: 'rick' } });
    fireEvent.click(screen.getByText('Search'));

    expect(await screen.findByText('Rick Sanchez')).toBeInTheDocument();
  });
});
