import { useQueryClient } from '@tanstack/react-query';

export default function RefreshButton({
  term,
  page = '1',
}: {
  term: string;
  page?: string;
}) {
  const qc = useQueryClient();
  const normalized = term.trim().toLowerCase();

  const refresh = async () => {
    await qc.invalidateQueries({
      queryKey: ['characters', normalized, page],
      exact: true,
    });
    await qc.refetchQueries({
      queryKey: ['characters', normalized, page],
      type: 'active',
      exact: true,
    });
  };

  return (
    <button
      className="px-3 py-2 rounded bg-stone-700 hover:bg-stone-600"
      onClick={refresh}
    >
      Refresh
    </button>
  );
}
