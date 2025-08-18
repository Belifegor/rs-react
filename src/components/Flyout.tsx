'use client';

import { useCallback } from 'react';
import { useStore } from '../store/store';

export default function Flyout() {
  const selected = useStore((s) => s.selected);
  const unselectAll = useStore((s) => s.unselectAll);

  const handleDownload = useCallback(() => {
    if (!selected.length) return;
    const params = new URLSearchParams({ ids: selected.join(',') });
    window.location.href = `/api/export?${params.toString()}`;
  }, [selected]);

  if (selected.length === 0) return null;

  return (
    <div className="fixed bottom-8 right-2 bg-gray-800 text-white px-6 py-3 rounded-2xl shadow-xl flex items-center gap-4 z-50">
      <span>
        {selected.length} item{selected.length > 1 ? 's' : ''} selected
      </span>
      <button
        className="px-3 py-1 rounded bg-blue-600 hover:bg-blue-700 transition"
        onClick={unselectAll}
      >
        Unselect all
      </button>
      <button
        data-testid="download-btn"
        className="px-3 py-1 rounded bg-green-600 hover:bg-green-700 transition"
        onClick={handleDownload}
      >
        Download
      </button>
    </div>
  );
}
