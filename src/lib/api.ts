import type { RMResponse } from '../types/types';

export const fetchCharacters = async (
  term: string,
  page = '1'
): Promise<RMResponse> => {
  const query = term.trim().toLowerCase();
  const params = new URLSearchParams();
  params.set('page', page);
  if (query) params.set('name', query);

  const url = `https://rickandmortyapi.com/api/character/?${params.toString()}`;
  const response = await fetch(url);
  if (!response.ok) throw new Error('Character not found');

  return response.json();
};

export const fetchPageData = async (url: string): Promise<RMResponse> => {
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error('Failed to fetch page');
  }

  return response.json();
};
