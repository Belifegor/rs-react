import type { RMResponse } from '../types/types';

export const fetchCharacters = async (
  term: string,
  page = '1'
): Promise<RMResponse> => {
  const query = term.trim().toLowerCase();
  let url = 'https://rickandmortyapi.com/api/character';
  if (query) {
    url += `/?name=${query}&page=${page}`;
  }
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error('Character not found');
  }

  return response.json();
};

export const fetchPageData = async (url: string): Promise<RMResponse> => {
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error('Failed to fetch page');
  }

  return response.json();
};
