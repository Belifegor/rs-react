import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Search from '../components/Search';
import type { Character } from '../types/types';
import Card from '../components/Card';
import { fetchCharacters } from '../api/rickAndMorty';
import { usePagination } from '../hooks/usePagination';
import { Pagination } from '../components/Pagination';
import { useLocalStorage } from '../hooks/useLocalStorage';
import { useCallback } from 'react';
import { useStore } from '../store/store';
import Flyout from '../components/Flyout';

export default function CharacterListPage() {
  const [searchTerm, setSearchTerm] = useLocalStorage('search', '');
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<Character[]>([]);
  const selected = useStore((s) => s.selected);
  const [error, setError] = useState<string | null>(null);
  const [totalPages, setTotalPages] = useState(1);
  const navigate = useNavigate();
  const { page = '1', detailsId } = useParams();

  const { paginationRange } = usePagination(totalPages);

  useEffect(() => {
    const pageNumber = parseInt(page);
    if (isNaN(pageNumber) || pageNumber < 1) {
      navigate('/not-found');
      return;
    }
  }, [page, navigate]);

  const fetchData = useCallback(
    async (term: string, page: string) => {
      const query = term.trim().toLowerCase();
      setLoading(true);
      setError(null);

      try {
        const data = await fetchCharacters(query, page);

        const pageNumber = parseInt(page);
        if (pageNumber > data.info.pages || pageNumber < 1) {
          console.log('Page not found, redirecting...');
          navigate('/not-found');
          return;
        }

        setResults(data.results);
        setTotalPages(data.info.pages);
      } catch (error) {
        console.error('Fetch error:', error);
        setError('No characters found for this search term.');
      } finally {
        setLoading(false);
      }
    },
    [navigate]
  );

  useEffect(() => {
    const query = searchTerm.trim().toLowerCase();
    if (query) fetchData(query, page || '1');
  }, [searchTerm, page, fetchData]);

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

  const gridClass =
    'grid grid-cols-1 sm:grid-cols-4 gap-6 w-full max-w-5xl mx-auto';

  return (
    <div className="w-full flex flex-col items-center justify-center">
      <Search onSearch={handleSearch} initialValue={searchTerm} />
      <h1 className="mb-4">Rick and Morty Characters</h1>
      <p className="mb-4 text-2xl text-stone-300">
        Search Term: <strong>{searchTerm}</strong>
      </p>

      {loading && <p>Loading...</p>}
      {error && <p style={{ color: 'red' }}>Error: {error}</p>}

      <div className={gridClass}>
        {results.map((char) => (
          <Card key={char.id} character={char} />
        ))}
        {selected.length > 0 && <Flyout items={results} />}
      </div>

      {!loading && !error && results.length > 0 && (
        <Pagination
          currentPage={parseInt(page)}
          paginationRange={paginationRange}
          onPageChange={goToPage}
        />
      )}
    </div>
  );
}
