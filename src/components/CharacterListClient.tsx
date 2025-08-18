'use client';

import React from 'react';
import { useRouter, useSearchParams } from 'next/navigation';

import type { RMResponse } from '@/types/types';

import Search from '@/components/Search';
import Card from '@/components/Card';
import { Pagination } from '@/components/Pagination';
import Flyout from '@/components/Flyout';
import RefreshButton from '@/components/RefreshButton';
import LoadingOverlay from '@/components/LoadingOverlay';
import { usePagination } from '@/hooks/usePagination';
import { useStore } from '@/store/store';
import { useCharactersQuery } from '@/hooks/useCharactersQuery';

type Props = {
  initialData: RMResponse;
  initialQuery: string;
  initialPage: string;
};

export default function CharacterListClient({
  initialData,
  initialQuery,
  initialPage,
}: Props) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const { data, isError, error, isFetching } = useCharactersQuery(
    initialQuery,
    initialPage
  );

  const selected = useStore((s) => s.selected);

  const results = data?.results ?? initialData.results ?? [];
  const totalPages = data?.info?.pages ?? initialData.info?.pages ?? 0;
  const currentPage = Number(initialPage) || 1;

  const { paginationRange } = usePagination(totalPages, currentPage);

  const goToPage = (newPage: number) => {
    const params = new URLSearchParams(searchParams?.toString());
    params.set('page', String(newPage));
    router.push(`?${params.toString()}`);
  };

  return (
    <div className="relative min-h-[60vh] w-full flex flex-col items-center justify-center p-4">
      <LoadingOverlay show={isFetching} label="Updating…" />

      <Search />
      <RefreshButton term={initialQuery} page={initialPage} />

      <h1 className="mb-4 text-3xl font-bold">Rick and Morty Characters</h1>
      {initialQuery && (
        <p className="mb-4 text-2xl text-stone-300">
          Search Term: <strong>{initialQuery}</strong>
        </p>
      )}

      {isError && (
        <p className="p-4 text-red-500">
          Error: {(error as Error)?.message ?? 'Something went wrong'}
        </p>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6 w-full max-w-5xl mx-auto cursor-pointer">
        {results.map((char) => (
          <Card key={char.id} character={char} />
        ))}
      </div>
      {selected.length > 0 && <Flyout />}
      {!isFetching && !isError && results.length === 0 && (
        <div
          role="alert"
          className="mt-8 p-4 text-red-500 bg-red-100 border border-red-400 rounded"
        >
          No characters found for this query.
        </div>
      )}

      {totalPages > 1 && (
        <Pagination
          currentPage={currentPage}
          paginationRange={paginationRange}
          onPageChange={goToPage}
        />
      )}
    </div>
  );
}
