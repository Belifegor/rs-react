import Spinner from './Spinner';

type LoadingOverlayProps = {
  show: boolean;
  label?: string;
};

export default function LoadingOverlay({ show, label }: LoadingOverlayProps) {
  if (!show) return null;

  const text = label ?? 'Loading…';

  return (
    <div
      role="status"
      aria-live="polite"
      aria-busy="true"
      data-testid="loading-overlay"
      className="absolute inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-[2px]"
    >
      <div className="rounded-xl bg-stone-800/80 px-4 py-3 shadow-lg">
        <Spinner label={text} />
        <span className="sr-only">{text}</span>
      </div>
    </div>
  );
}
