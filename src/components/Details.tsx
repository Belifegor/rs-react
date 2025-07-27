import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import type { Character } from '../types/types';

export default function Details() {
  const navigate = useNavigate();
  const { detailsId, page = '1' } = useParams();

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
      .catch((err) => {
        setError(err.message);
        navigate('/not-found');
      })
      .finally(() => setLoading(false));
  }, [detailsId, navigate]);

  if (loading) return <div className="p-4">In progress...</div>;

  if (error) return <div className="p-4 text-red-500">Error: {error}</div>;

  if (!character) return null;

  return (
    <div className="p-4 border-l bg-gray-700 relative">
      <button
        className="absolute top-2 right-2 bg-gray-800 rounded px-3 py-1 text-white hover:bg-gray-600"
        onClick={() => navigate(`/${page}`)}
        title="Close details"
      >
        ×
      </button>
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
