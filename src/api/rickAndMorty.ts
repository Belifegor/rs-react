import type { RMResponse } from '../types/types';

export const fetchCharacters = async (term: string): Promise<RMResponse> => {
  const query = term.trim().toLowerCase();
  const url = query
    ? `https://rickandmortyapi.com/api/character/?name=${query}`
    : `https://rickandmortyapi.com/api/character`;

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
