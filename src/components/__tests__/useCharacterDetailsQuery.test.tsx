import { renderHook, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { vi } from 'vitest';
import { useCharacterDetailsQuery } from '../../hooks/useCharacterDetailsQuery';

const createWrapper = () => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        retry: 0,
        staleTime: 0,
        gcTime: 0,
      },
    },
  });

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

  it('should handle fetch error (no retries in tests)', async () => {
    vi.spyOn(globalThis, 'fetch').mockResolvedValueOnce({
      ok: false,
      json: async () => ({}),
    } as Response);

    const { result } = renderHook(() => useCharacterDetailsQuery('999'), {
      wrapper: createWrapper(),
    });

    await waitFor(() => {
      expect(result.current.fetchStatus).toBe('idle');
      expect(result.current.isError).toBe(true);
    });

    expect((result.current.error as Error).message).toBe(
      'Failed to load character details'
    );
  });
});
