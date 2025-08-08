import { useQuery } from '@tanstack/react-query';
import { fetchCharacters } from '../api/api';
import type { RMResponse } from '../types/types';

export const useChatactersQuery = (term: string, page: string) =>
  useQuery<RMResponse>({
    queryKey: ['characters', term, page],
    queryFn: () => fetchCharacters(term, page),
    staleTime: 1000 * 60 * 5,
  });
