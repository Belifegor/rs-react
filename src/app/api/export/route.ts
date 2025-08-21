import { NextResponse } from 'next/server';

type Character = {
  id: number;
  name: string;
  status: string;
  species: string;
  gender: string;
  origin?: { name: string };
  location?: { name: string };
  image: string;
};

const escapeForCSV = (value: unknown): string =>
  `"${String(value ?? '').replace(/"/g, '""')}"`;

function convertToCSV<T extends Record<string, unknown>>(objects: T[]): string {
  if (objects.length === 0) return '';

  const columnNames = Object.keys(objects[0]) as (keyof T)[];
  const headerLine = columnNames.join(',');

  const dataLines = objects
    .map((obj) => columnNames.map((col) => escapeForCSV(obj[col])).join(','))
    .join('\n');

  return `${headerLine}\n${dataLines}`;
}

async function getCharactersByIds(ids: number[]): Promise<Character[]> {
  const url = `https://rickandmortyapi.com/api/character/${ids.join(',')}`;
  const response = await fetch(url, { cache: 'no-store' });

  if (!response.ok) return [];
  const data = await response.json();

  return Array.isArray(data) ? data : [data];
}

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const idsParam = searchParams.get('ids');

  if (!idsParam) {
    return NextResponse.json(
      { error: 'Не переданы ids. Пример: /api/export?ids=1,2,3' },
      { status: 400 }
    );
  }

  const ids = idsParam
    .split(',')
    .map((s) => Number(s.trim()))
    .filter((n) => Number.isFinite(n));

  if (ids.length === 0) {
    return NextResponse.json(
      { error: 'Нет корректных id персонажей' },
      { status: 400 }
    );
  }

  const characters = await getCharactersByIds(ids);

  const characterData = characters.map((c) => ({
    id: c.id,
    name: c.name,
    status: c.status,
    species: c.species,
    gender: c.gender,
    origin: c.origin?.name ?? '',
    location: c.location?.name ?? '',
    image: c.image,
    details_url: `https://rickandmortyapi.com/api/character/${c.id}`,
  }));

  const csvContent = convertToCSV(characterData);

  return new NextResponse(csvContent, {
    headers: {
      'Content-Type': 'text/csv; charset=utf-8',
      'Content-Disposition': `attachment; filename="characters-${ids.length}_items.csv"`,
      'Cache-Control': 'no-store',
    },
  });
}
