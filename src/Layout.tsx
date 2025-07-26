import '../src/assets/styles/App.css';
import { useEffect, useState } from 'react';
import { useParams, useNavigate, Outlet } from 'react-router';
import Search from './components/Search';
import type { Character } from './types/types';
import Card from './components/Card';
import { fetchCharacters } from './api/rickAndMorty';
import { usePagination } from './hooks/usePagination';
import { Pagination } from './components/Pagination';
import { useLocalStorage } from './hooks/useLocalStorage';

export default function App() {
  const [searchTerm, setSearchTerm] = useLocalStorage('search', '');
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<Character[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [hasError, setHasError] = useState(false);
  const [totalPages, setTotalPages] = useState(1);
  const navigate = useNavigate();
  const { page = '1', detailsId } = useParams();

  const { paginationRange } = usePagination(totalPages);

  useEffect(() => {
    const query = searchTerm.trim().toLowerCase();
    if (query) fetchData(query, page || '1');
  }, [searchTerm, page]);

  const fetchData = (term: string, page: string) => {
    const query = term.trim().toLowerCase();
    setLoading(true);
    setError(null);

    fetchCharacters(query, page)
      .then((data) => {
        setResults(data.results);
        setTotalPages(data.info.pages);
        setLoading(false);
      })
      .catch((error) => {
        setError(error.message);
        setLoading(false);
      });
  };

  const goToPage = (newPage: number) => {
    const newPath = detailsId ? `/${newPage}/${detailsId}` : `/${newPage}`;
    navigate(newPath);
  };

  const handleSearch = (term: string) => {
    const cleane = term.trim().toLowerCase();
    localStorage.setItem('search', cleane);
    setSearchTerm(cleane);
    navigate(`/1`);
  };

  if (hasError) {
    throw new Error('Simulated error');
  }
  return (
    <>
      <div className="flex gap-4">
        <div className="w-full sm:w-2/3">
          <Search onSearch={handleSearch} initialValue={searchTerm} />
          <div>
            <h1 className="mb-4">Rick and Morty Characters</h1>
            <p className="mb-4 text-2xl text-stone-300">
              Search Term: <strong>{searchTerm}</strong>
            </p>

            {loading && <p>Loading...</p>}
            {error && <p style={{ color: 'red' }}>Error: {error}</p>}

            <div className="grid grid-cols-1 sm:grid-cols-4 sm:gap-6">
              {results.map((char) => (
                <Card key={char.id} character={char} />
              ))}
            </div>

            {!loading && !error && results.length > 0 && (
              <Pagination
                currentPage={parseInt(page)}
                paginationRange={paginationRange}
                onPageChange={goToPage}
              />
            )}

            <button
              onClick={() => setHasError(true)}
              className="mt-5 px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors"
            >
              Simulate Error
            </button>
          </div>
        </div>

        {detailsId && (
          <div className="w-full sm:w-1/3">
            <Outlet />
          </div>
        )}
      </div>
    </>
  );
}
