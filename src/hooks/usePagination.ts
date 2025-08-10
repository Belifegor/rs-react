import { useMemo } from 'react';
import { DOTS, type PageItem } from '../types/pagination';

export function usePagination(
  totalPages: number,
  currentPage: number,
  delta = 1
): { paginationRange: PageItem[] } {
  return useMemo(() => {
    const paginationRange: PageItem[] = [];

    if (totalPages <= 0) {
      return { paginationRange };
    }

    const page = Math.max(1, Math.min(currentPage, totalPages));
    const left = Math.max(2, page - delta);
    const right = Math.min(totalPages - 1, page + delta);

    paginationRange.push(1);
    if (left > 2) paginationRange.push(DOTS);
    for (let i = left; i <= right; i++) paginationRange.push(i);
    if (right < totalPages - 1) paginationRange.push(DOTS);
    if (totalPages > 1) paginationRange.push(totalPages);

    return { paginationRange };
  }, [totalPages, currentPage, delta]);
}
