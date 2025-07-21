import type { Character } from '../types/types';

type Props = {
  character: Character;
};

const Card = ({ character }: Props) => (
  <div
    className="bg-gray-700 shadow-md rounded-lg p-4 flex flex-col items-center"
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
    <p className="text-sm text-stone-400 text-center">
      {character.species}, {character.gender}
    </p>
  </div>
);

export default Card;
