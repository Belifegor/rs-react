'use client';

import Link from 'next/link';
import Image from 'next/image';
import type { Character } from '../types/types';
import { useStore } from '../store/store';

export default function Card({ character }: { character: Character }) {
  const isSelected = useStore((s) => s.isSelected(character.id));
  const toggle = useStore((s) => s.toggle);

  const handleCheckboxClick = (e: React.MouseEvent<HTMLInputElement>) => {
    e.stopPropagation();
    e.preventDefault();
    toggle(character.id);
  };

  return (
    <Link
      href={`/details/${character.id}`}
      scroll={false}
      className="relative bg-gray-700 shadow-md rounded-lg p-6 flex flex-col items-center transform hover:scale-105 transition-transform duration-200 cursor-pointer"
      data-testid="card"
    >
      <Image
        src={character.image}
        alt={character.name}
        width={128}
        height={128}
        className="w-32 h-32 object-cover rounded-full mb-4"
      />
      <h2 className="text-lg font-semibold text-center text-stone-300">
        {character.name}
      </h2>
      <p className="text-sm text-black-400 text-center">
        {character.species}, {character.gender}
      </p>
      <div
        className="absolute bottom-3 right-3 h-8 w-8 flex items-center justify-center"
        onClick={handleCheckboxClick}
      >
        <input
          type="checkbox"
          checked={isSelected}
          onChange={() => toggle(character.id)}
          onClick={handleCheckboxClick}
          className="absolute bottom-3 right-3 scale-150 accent-blue-600 cursor-pointer"
        />
      </div>
    </Link>
  );
}
