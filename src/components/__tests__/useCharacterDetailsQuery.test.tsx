import { renderHook, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { vi } from 'vitest';
import { useCharacterDetailsQuery } from '../../hooks/useCharacterDetailsQuery';

const createWrapper = () => {
  const queryClient = new QueryClient();
  const Wrapper = ({ children }: { children: React.ReactNode }) => (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
  Wrapper.displayName = 'QueryClientTestWrapper';
  return Wrapper;
};

describe('useCharacterDetailsQuery', () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  it('should fetch character details successfully', async () => {
    const fakeCharacter = {
      id: 1,
      name: 'Rick Sanchez',
      image: 'https://rickandmortyapi.com/api/character/avatar/1.jpeg',
      status: 'Alive',
      species: 'Human',
      gender: 'Male',
    };

    vi.spyOn(global, 'fetch').mockResolvedValueOnce({
      ok: true,
      json: async () => fakeCharacter,
    } as Response);

    const { result } = renderHook(() => useCharacterDetailsQuery('1'), {
      wrapper: createWrapper(),
    });

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true);
    });

    expect(fetch).toHaveBeenCalledWith(
      'https://rickandmortyapi.com/api/character/1'
    );
    expect(result.current.data).toEqual(fakeCharacter);
  });

  it('should handle fetch error', async () => {
    vi.spyOn(global, 'fetch').mockResolvedValueOnce({
      ok: false,
      status: 404,
      json: async () => ({}),
    } as Response);

    const { result } = renderHook(() => useCharacterDetailsQuery('999'), {
      wrapper: createWrapper(),
    });

    await waitFor(
      () => {
        console.log(
          'isError:',
          result.current.isError,
          'error:',
          result.current.error
        );
        expect(result.current.isError).toBe(true);
      },
      { timeout: 2000 }
    );

    expect(result.current.error).toEqual(
      new Error('Failed to load character details')
    );
  });
});
