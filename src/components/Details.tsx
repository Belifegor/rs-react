import { useNavigate, useParams } from 'react-router-dom';
import { useCharacterDetailsQuery } from '../hooks/useCharacterDetailsQuery';
import LoadingOverlay from '../components/LoadingOverlay';

export default function Details() {
  const navigate = useNavigate();
  const { detailsId, page = '1' } = useParams();
  const {
    data: character,
    isLoading,
    isFetching,
    error,
  } = useCharacterDetailsQuery(detailsId);

  if (!detailsId) return null;
  if (error)
    return (
      <div className="p-4 text-red-500">Error: {(error as Error).message}</div>
    );

  return (
    <div className="relative bg-gray-800 rounded-lg shadow-lg overflow-hidden">
      <LoadingOverlay
        show={isLoading || isFetching}
        label={isLoading ? 'Loading details…' : 'Updating…'}
      />

      {character && (
        <>
          <div className="relative">
            <button
              className="absolute top-2 right-2 bg-gray-900 bg-opacity-50 rounded-full p-1 text-white hover:bg-gray-700 focus:outline-none"
              onClick={() => navigate(`/${page}`)}
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
              <img
                src={character.image}
                alt={character.name}
                className="w-full h-full object-cover"
              />
            </div>
          </div>
          <div className="p-4">
            <h2 className="text-xl font-bold mb-2 text-white">
              {character.name}
            </h2>
            <div className="space-y-1 text-gray-300">
              <p>
                <span className="font-semibold">Status:</span>{' '}
                {character.status}
              </p>
              <p>
                <span className="font-semibold">Species:</span>{' '}
                {character.species}
              </p>
              <p>
                <span className="font-semibold">Gender:</span>{' '}
                {character.gender}
              </p>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
