import { useEffect, useState } from 'react';
import { useParams } from 'react-router';
import type { Character } from '../types/types';

export default function Details() {
  const { detailsId } = useParams();

  const [character, setCharacter] = useState<Character | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!detailsId) return;

    setLoading(true);
    setError(null);

    fetch(`https://rickandmortyapi.com/api/character/${detailsId}`)
      .then((res) => {
        if (!res.ok) throw new Error('Failed to load character');
        return res.json();
      })
      .then((data) => setCharacter(data))
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, [detailsId]);

  if (loading) return <div className="p-4">In progress...</div>;

  if (error) return <div className="p-4 text-red-500">Error: {error}</div>;

  if (!character) return null;

  return (
    <div className="p-4 border-l bg-gray-700">
      <h2 className="text-xl font-bold mb-2">{character.name}</h2>
      <img
        src={character.image}
        alt={character.name}
        className="w-full h-auto rounded"
      />
      <p>Status: {character.status}</p>
      <p>Species: {character.species}</p>
      <p>Gender: {character.gender}</p>
    </div>
  );
}
