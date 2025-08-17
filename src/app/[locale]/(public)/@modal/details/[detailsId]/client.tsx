'use client';

import { useRouter } from 'next/navigation';
import Image from 'next/image';
import type { Character } from '@/types/types';

export default function ClientDetails({ character }: { character: Character }) {
  const router = useRouter();

  return (
    <div className="relative bg-gray-800 rounded-lg shadow-lg overflow-hidden">
      <div className="relative">
        <button
          className="absolute top-2 right-2 bg-gray-900 bg-opacity-50 rounded-full p-1 text-white hover:bg-gray-700 focus:outline-none"
          onClick={() => router.back()}
          title="Close details"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>
        <div className="h-64 overflow-hidden">
          <Image
            src={character.image}
            alt={character.name}
            width={400}
            height={400}
            className="w-full h-full object-cover"
            priority
          />
        </div>
      </div>
      <div className="p-4">
        <h2 className="text-xl font-bold mb-2 text-white">{character.name}</h2>
        <div className="space-y-1 text-gray-300">
          <p>
            <span className="font-semibold">Status:</span> {character.status}
          </p>
          <p>
            <span className="font-semibold">Species:</span> {character.species}
          </p>
          <p>
            <span className="font-semibold">Gender:</span> {character.gender}
          </p>
        </div>
      </div>
    </div>
  );
}
