import ClientDetails from './client';

async function getCharacter(id: string) {
  const res = await fetch(`https://rickandmortyapi.com/api/character/${id}`);
  if (!res.ok) return undefined;
  return res.json();
}

export default async function DetailsModalPage({
  params,
}: {
  params: Promise<{ locale: string; detailsId: string }>;
}) {
  const awaitedParams = await params;
  const character = await getCharacter(awaitedParams.detailsId);

  if (!character) {
    return null;
  }

  return (
    <div className="w-96 p-4 mt-16 md:mt-56">
      <ClientDetails character={character} />
    </div>
  );
}
