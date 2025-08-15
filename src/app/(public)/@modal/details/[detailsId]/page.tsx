import ClientDetails from '@/app/(public)/details/[detailsId]/client';

async function getCharacter(id: string) {
  const res = await fetch(`https://rickandmortyapi.com/api/character/${id}`);
  if (!res.ok) return undefined;
  return res.json();
}

export default async function DetailsModalPage({
  params,
}: {
  params: { detailsId: string };
}) {
  const character = await getCharacter(params.detailsId);

  if (!character) {
    return null;
  }

  return <ClientDetails character={character} />;
}
