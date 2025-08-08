import { useQuery, keepPreviousData } from '@tanstack/react-query';
import { fetchCharacters } from '../api/api';
import type { RMResponse } from '../types/types';

export const useChatactersQuery = (term: string, page: string) => {
  const normalizedTerm = term.trim().toLowerCase();

  return useQuery<RMResponse>({
    queryKey: ['characters', normalizedTerm, page],
    queryFn: () => fetchCharacters(normalizedTerm, page),
    staleTime: 1000 * 60 * 5,
    gcTime: 1000 * 60 * 30,
    placeholderData: keepPreviousData,
    retry: 1,
  });
};
