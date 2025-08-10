export default function Spinner({ label = 'Loading...' }: { label?: string }) {
  return (
    <div className="flex items-center gap-2">
      <svg className="h-5 w-5 animate-spin" viewBox="0 0 24 24">
        <circle
          cx="12"
          cy="12"
          r="10"
          stroke="currentColor"
          strokeWidth="4"
          fill="none"
          className="opacity-25"
        />
        <path
          d="M12 2a10 10 0 0 1 10 10h-4a6 6 0 0 0-6-6V2z"
          className="opacity-75"
          fill="currentColor"
        />
      </svg>
      <span className="text-sm">{label}</span>
    </div>
  );
}
