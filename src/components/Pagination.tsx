import { DOTS, type PageItem } from '../types/pagination';

export const Pagination = ({
  currentPage,
  paginationRange,
  onPageChange,
}: {
  currentPage: number;
  paginationRange: PageItem[];
  onPageChange: (page: number) => void;
}) => (
  <nav
    className="mt-4 flex justify-center gap-2 flex-wrap"
    aria-label="Pagination"
  >
    {paginationRange.map((item, index) =>
      item === DOTS ? (
        <span key={`dots-${index}`} className="px-2 py-3" aria-hidden="true">
          …
        </span>
      ) : (
        <button
          key={`page-${item}`}
          type="button"
          onClick={() => onPageChange(item)}
          aria-label={`Go to page ${item}`}
          data-testid={`page-${item}`}
          aria-current={item === currentPage ? 'page' : undefined}
          disabled={item === currentPage}
          className={`px-3 py-1 rounded ${
            item === currentPage
              ? 'bg-blue-600 text-white'
              : 'bg-gray-200 text-gray-600 hover:bg-gray-300'
          }`}
        >
          {item}
        </button>
      )
    )}
  </nav>
);
