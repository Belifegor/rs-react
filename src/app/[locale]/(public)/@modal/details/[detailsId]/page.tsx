import ClientDetails from './client';

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
  const { detailsId } = await params;
  const character = await getCharacter(detailsId);

  if (!character) {
    return null;
  }

  return (
    <div className="w-96 p-4 mt-16 md:mt-56">
      <ClientDetails character={character} />
    </div>
  );
}
