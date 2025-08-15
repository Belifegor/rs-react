import CharacterListClient from '@/components/CharacterListClient';

async function getCharacters(query: string = '', page: string = '1') {
  const params = new URLSearchParams({ page });
  if (query) {
    params.set('name', query);
  }
  const url = `https://rickandmortyapi.com/api/character/?${params.toString()}`;

  try {
    const res = await fetch(url);
    if (!res.ok) {
      return { info: { pages: 0, count: 0 }, results: [] };
    }
    return res.json();
  } catch (error) {
    console.error('Failed to fetch characters:', error);
    return { info: { pages: 0, count: 0 }, results: [] };
  }
}

export default async function HomePage({
  searchParams,
}: {
  searchParams?: { query?: string; page?: string };
}) {
  const query = searchParams?.query || '';
  const page = searchParams?.page || '1';

  const initialData = await getCharacters(query, page);

  return (
    <CharacterListClient
      initialData={initialData}
      initialQuery={query}
      initialPage={page}
    />
  );
}
