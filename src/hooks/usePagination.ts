import { useMemo } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

export const usePagination = (totalPages: number) => {
  const navigate = useNavigate();
  const { page = '1' } = useParams();
  const currentPage = parseInt(page);

  const goToPage = (newPage: number) => {
    navigate(`/${newPage}`);
  };

  const paginationRange = useMemo(() => {
    const range: (number | string)[] = [];
    const delta = 1;
    const left = Math.max(2, currentPage - delta);
    const right = Math.min(totalPages - 1, currentPage + delta);

    range.push(1);

    if (left > 2) range.push('...');

    for (let i = left; i <= right; i++) {
      range.push(i);
    }

    if (right < totalPages - 1) range.push('...');

    if (totalPages > 1) range.push(totalPages);

    return range;
  }, [currentPage, totalPages]);

  return { currentPage, goToPage, paginationRange };
};
