import { useQuery } from '@tanstack/react-query';

async function fetchCharacterByID(id: string) {
  const res = await fetch(`https://rickandmortyapi.com/api/character/${id}`);
  if (!res.ok) {
    throw new Error('Failed to load character details');
  }
  return res.json();
}

export function useCharacterDetailsQuery(id?: string) {
  return useQuery({
    queryKey: ['character', id],
    queryFn: () => {
      if (!id) {
        return Promise.reject(new Error('Character ID is required'));
      }
      return fetchCharacterByID(id);
    },
    enabled: !!id,
    staleTime: 1000 * 60 * 5,
    gcTime: 1000 * 60 * 30,
    retry: 1,
  });
}
