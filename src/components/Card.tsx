import type { Character } from '../types/types';
import { useNavigate, useParams } from 'react-router-dom';
import { useSelectionStore } from './store/selectedCharacters';

export default function Card({ character }: { character: Character }) {
  const navigate = useNavigate();
  const { page = '1' } = useParams();
  const isSelected = useSelectionStore((state) =>
    state.isSelected(character.id)
  );
  const toggle = useSelectionStore((state) => state.toggle);

  return (
    <div
      onClick={() => navigate(`/${page}/${character.id}`)}
      className="relative bg-gray-700 shadow-md rounded-lg p-6 flex flex-col items-center"
      data-testid="card"
    >
      <img
        src={character.image}
        alt={character.name}
        className="w-32 h-32 object-cover rounded-full mb-4"
      />
      <h2 className="text-lg font-semibold text-center text-stone-300">
        {character.name}
      </h2>
      <p className="text-sm text-black-400 text-center">
        {character.species}, {character.gender}
      </p>
      <input
        type="checkbox"
        checked={isSelected}
        onChange={() => toggle(character.id)}
        onClick={(e) => e.stopPropagation()}
        className="absolute bottom-3 right-3 scale-150 accent-blue-600 cursor-pointer"
      />
    </div>
  );
}
