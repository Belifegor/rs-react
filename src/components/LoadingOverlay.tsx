import Spinner from './Spinner';

export default function LoadingOverlay({
  show,
  label,
}: {
  show: boolean;
  label?: string;
}) {
  if (!show) return null;
  return (
    <div
      className="absolute inset-0 z-50 flex items-center justify-center
                 bg-black/30 backdrop-blur-[2px]"
      aria-busy="true"
    >
      <div className="rounded-xl bg-stone-800/80 px-4 py-3 shadow-lg">
        <Spinner label={label} />
      </div>
    </div>
  );
}
