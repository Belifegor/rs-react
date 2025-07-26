import { useMemo } from 'react';
import { useSearchParams } from 'react-router';

export const usePagination = (totalPages: number) => {
  const [searchParams, setSearchParams] = useSearchParams();
  const currentPage = parseInt(searchParams.get('page') ?? '1');

  const goToPage = (page: number) => {
    setSearchParams({ page: page.toString() });
  };

  const paginationRange = useMemo(() => {
    const range: (number | string)[] = [];
    let addedLeftDots = false;
    let addedRightDots = false;

    for (let i = 1; i <= totalPages; i++) {
      if (
        i === 1 ||
        i === totalPages ||
        (i >= currentPage - 1 && i <= currentPage + 2)
      ) {
        range.push(i);
      } else if (i < currentPage && !addedLeftDots) {
        range.push('...');
        addedLeftDots = true;
      } else if (i > currentPage && !addedRightDots) {
        range.push('...');
        addedRightDots = true;
      }
    }

    return range;
  }, [currentPage, totalPages]);

  return { currentPage, goToPage, paginationRange };
};
