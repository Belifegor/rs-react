import { useEffect } from 'react';
import { useParams, useNavigate, Outlet } from 'react-router-dom';
import Search from '../components/Search';
import Card from '../components/Card';
import { usePagination } from '../hooks/usePagination';
import { Pagination } from '../components/Pagination';
import { useLocalStorage } from '../hooks/useLocalStorage';
import { useStore } from '../store/store';
import Flyout from '../components/Flyout';
import { useChatactersQuery } from '../hooks/useCharactersQuery';

export default function CharacterListPage() {
  const [searchTerm, setSearchTerm] = useLocalStorage('search', '');
  const { page = '1', detailsId } = useParams();
  const navigate = useNavigate();
  const selected = useStore((s) => s.selected);

  useEffect(() => {
    const pageNumber = Number(page);
    if (!Number.isFinite(pageNumber) || pageNumber < 1) {
      navigate('/not-found');
    }
  }, [page, navigate]);

  const { data, isLoading, isError, error } = useChatactersQuery(
    searchTerm.trim().toLowerCase(),
    page || '1'
  );

  const totalPages = data?.info.pages || 0;
  const { paginationRange } = usePagination(totalPages);

  useEffect(() => {
    if (data) {
      const pageNumber = Number(page);
      if (pageNumber > data.info.pages) {
        navigate('/1', { replace: true });
      }
    }
  }, [data, page, navigate]);

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

  const results = data?.results ?? [];

  return (
    <div className="w-full flex flex-col items-center justify-center">
      <Search onSearch={handleSearch} initialValue={searchTerm} />
      <h1 className="mb-4">Rick and Morty Characters</h1>
      <p className="mb-4 text-2xl text-stone-300">
        Search Term: <strong>{searchTerm}</strong>
      </p>

      {isLoading && <p>Loading...</p>}
      {isError && (
        <p style={{ color: 'red' }}>
          Error: {(error as Error)?.message ?? 'Something went wrong'}
        </p>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-4 gap-6 w-full max-w-5xl mx-auto cursor-pointer">
        {results.slice(0, 8).map((char) => (
          <Card key={char.id} character={char} />
        ))}
        {selected.length > 0 && <Flyout items={results} />}
      </div>

      {!isLoading && !isError && results.length > 0 && (
        <Pagination
          currentPage={parseInt(page)}
          paginationRange={paginationRange}
          onPageChange={goToPage}
        />
      )}
      <div className="w-1/3 p-4 overflow-y-auto m-auto">
        <Outlet />
      </div>
    </div>
  );
}
