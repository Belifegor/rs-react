import { useStore } from '../store/store';
import type { Character } from '../types/types';

export default function Flyout({ items }: { items: Character[] }) {
  const selected = useStore((s) => s.selected);
  const unselectAll = useStore((s) => s.unselectAll);

  const selectedItems =
    items?.filter((item) => selected.includes(item.id)) ?? [];

  const handleDownload = () => {
    if (!selectedItems.length) return;

    const csvRows = [
      ['id', 'name', 'status', 'gender'],
      ...selectedItems.map((item) => [
        item.id,
        item.name,
        item.status,
        item.gender,
        `${window.location.origin}/${item.id}`,
      ]),
    ]
      .map((row) => row.map(String).join(','))
      .join('\n');

    console.log('selectedItems', selectedItems);
    const blob = new Blob([csvRows], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${selected.length}_items.csv`;
    document.body.appendChild(a);
    setTimeout(() => {
      a.click();
      window.URL.revokeObjectURL(url);
      a.remove();
    }, 0);
  };
  if (selected.length === 0) return null;

  return (
    <div className="fixed bottom-5 right-2 -translate-x-1/2 bg-gray-800 text-white px-6 py-3 rounded-2xl shadow-xl flex items-center gap-4 z-50">
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
        className="px-3 py-1 rounded bg-green-600 hover:bg-green-700 transition"
        onClick={handleDownload}
      >
        Download
      </button>
    </div>
  );
}
