import { useEffect, useMemo } from 'react';
import Search from '../components/Search';
import Card from '../components/Card';
import { usePagination } from '../hooks/usePagination';
import { Pagination } from '../components/Pagination';
import { useLocalStorage } from '../hooks/useLocalStorage';
import { useStore } from '../store/store';
import Flyout from '../components/Flyout';
import { useCharactersQuery } from '../hooks/useCharactersQuery';
import RefreshButton from '../components/RefreshButton';
import LoadingOverlay from '../components/LoadingOverlay';
import { useRouter } from 'next/navigation';

type Props = {
  page?: string;
  detailsId?: string;
};

export default function CharacterListPage({ page = '1', detailsId }: Props) {
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useLocalStorage('search', '');

  const current = Number(page) || 1;
  const selected = useStore((s) => s.selected);

  const normalizedTerm = useMemo(
    () => searchTerm.trim().toLowerCase(),
    [searchTerm]
  );

  useEffect(() => {
    const pageNumber = Number(page);
    if (!Number.isFinite(pageNumber) || pageNumber < 1) {
      router.push('/not-found');
    }
  }, [page, router]);

  const { data, isLoading, isError, error, isFetching } = useCharactersQuery(
    normalizedTerm,
    String(current)
  );

  const totalPages = data?.info.pages || 0;
  const { paginationRange } = usePagination(totalPages, current);

  useEffect(() => {
    if (data) {
      const pageNumber = Number(page);
      if (pageNumber > data.info.pages) {
        router.replace('/1');
      }
    }
  }, [data, page, router]);

  const goToPage = (newPage: number) => {
    const newPath = detailsId ? `/${newPage}/${detailsId}` : `/${newPage}`;
    router.push(newPath);
  };

  const handleSearch = (term: string) => {
    const cleane = term.trim().toLowerCase();
    localStorage.setItem('search', cleane);
    setSearchTerm(cleane);
    router.push(`/1`);
  };

  const results = data?.results ?? [];

  return (
    <div className="relative min-h-[60vh] w-full flex flex-col items-center justify-center">
      <LoadingOverlay
        show={isLoading || isFetching}
        label={isLoading ? 'Loading…' : 'Updating…'}
      />

      <Search onSearch={handleSearch} initialValue={searchTerm} />
      <RefreshButton term={searchTerm} page={page} />

      <h1 className="mb-4">Rick and Morty Characters</h1>
      <p className="mb-4 text-2xl text-stone-300">
        Search Term: <strong>{searchTerm}</strong>
      </p>

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

      {!isLoading && !isError && results.length === 0 && (
        <div
          role="alert"
          aria-live="assertive"
          data-testid="error"
          style={{ color: 'red' }}
        >
          Error:{' '}
          {(error as unknown as Error)?.message ?? 'Something went wrong'}
        </div>
      )}

      {!isLoading && !isError && results.length > 0 && (
        <Pagination
          currentPage={parseInt(page)}
          paginationRange={paginationRange}
          onPageChange={goToPage}
        />
      )}
      {/* <div className="w-1/3 p-4 overflow-y-auto m-auto">
        <Outlet />
      </div> */}
    </div>
  );
}
