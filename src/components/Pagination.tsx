export const Pagination = ({
  currentPage,
  paginationRange,
  onPageChange,
}: {
  currentPage: number;
  paginationRange: (number | string)[];
  onPageChange: (page: number) => void;
}) => (
  <div className="mt-4 flex justify-center gap-2 flex-wrap">
    {paginationRange.map((item, index) =>
      item === '...' ? (
        <span key={`dots-${index}`} className="px-2 py-3">
          ...
        </span>
      ) : (
        <button
          key={`page-${item}`}
          onClick={() => onPageChange(item as number)}
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
  </div>
);
