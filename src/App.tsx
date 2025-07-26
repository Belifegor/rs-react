import '../src/assets/styles/App.css';
import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router';
import Search from './components/Search';
import type { Character } from './types/types';
import Card from './components/Card';
import { fetchCharacters } from './api/rickAndMorty';
import { usePagination } from './hooks/usePagination';
import { Pagination } from './components/Pagination';

export default function App() {
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<Character[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [totalPages, setTotalPages] = useState(1);
  const [searchParams, setSearchParams] = useSearchParams();
  const page = searchParams.get('page') ?? '1';

  const { paginationRange } = usePagination(totalPages);

  useEffect(() => {
    const savedTerm = localStorage.getItem('search') ?? '';
    if (!searchTerm && savedTerm) {
      setSearchTerm(savedTerm);
    }
  }, [searchTerm]);

  useEffect(() => {
    const query = searchTerm.trim().toLowerCase();
    fetchData(query, page);
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

  const goToPage = (newPage: string) => {
    setSearchParams({ page: newPage });
  };

  const handleSearch = (term: string) => {
    const cleane = term.trim().toLowerCase();
    localStorage.setItem('search', cleane);
    setSearchTerm(cleane);
    setSearchParams({ page: '1' });
  };

  return (
    <>
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
        <Pagination
          currentPage={parseInt(page)}
          paginationRange={paginationRange}
          onPageChange={(newPage) => goToPage(newPage.toString())}
        />
      </div>
    </>
  );
}
