import CharacterListClient from '@/components/CharacterListClient';
import type { RMResponse } from '@/types/types';

export const dynamic = 'force-dynamic';

async function getCharacters(
  query: string = '',
  page: string = '1'
): Promise<RMResponse> {
  const params = new URLSearchParams({ page });
  if (query) {
    params.set('name', query);
  }
  const url = `https://rickandmortyapi.com/api/character/?${params.toString()}`;

  try {
    const res = await fetch(url, { cache: 'no-store' });
    if (!res.ok) {
      return {
        info: { pages: 0, count: 0, next: null, prev: null },
        results: [],
      };
    }
    return res.json();
  } catch (error) {
    console.error('Failed to fetch characters:', error);
    return {
      info: { pages: 0, count: 0, next: null, prev: null },
      results: [],
    };
  }
}

export default async function HomePage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const awaitedSearchParams = await searchParams;

  const query =
    typeof awaitedSearchParams.query === 'string'
      ? awaitedSearchParams.query
      : '';
  const page =
    typeof awaitedSearchParams.page === 'string'
      ? awaitedSearchParams.page
      : '1';

  const initialData = await getCharacters(query, page);

  return (
    <CharacterListClient
      initialData={initialData}
      initialQuery={query}
      initialPage={page}
    />
  );
}
