import type { Character } from '../types/types';
import { useRouter, useParams } from 'next/navigation';
import { useStore } from '../store/store';

export default function Card({ character }: { character: Character }) {
  const router = useRouter();
  const params = useParams();

  const page = Array.isArray(params?.page)
    ? params.page[0]
    : (params?.page ?? '1');

  const isSelected = useStore((s) => s.isSelected(character.id));
  const toggle = useStore((s) => s.toggle);

  const handleCardClick = () => {
    router.push(`/${page}/${character.id}`);
  };

  const handleCheckboxClick = (e: React.MouseEvent<HTMLInputElement>) => {
    e.stopPropagation();
    toggle(character.id);
  };

  return (
    <div
      onClick={handleCardClick}
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
        onClick={handleCheckboxClick}
        className="absolute bottom-3 right-3 scale-150 accent-blue-600 cursor-pointer"
      />
    </div>
  );
}
