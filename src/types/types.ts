import type { ReactNode } from 'react';

export type PropsError = {
  children: ReactNode;
  fallback: ReactNode;
};

export type StateError = {
  hasError: boolean;
};

export type PropsSearch = {
  onSearch: (query: string) => void;
  initialValue: string;
};

export type StateSearch = {
  inputValue: string;
};

export type Character = {
  id: number;
  name: string;
  status: string;
  species: string;
  gender: string;
  image: string;
};

export type RMResponse = {
  info: {
    count: number;
    pages: number;
    next: string | null;
    prev: string | null;
  };
  results: Character[];
};

export type AppState = {
  searchTerm: string;
  loading: boolean;
  results: Character[];
  error: string | null;
  nextPage: string | null;
  prevPage: string | null;
  hasError: boolean;
};
