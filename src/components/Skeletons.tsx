export function MainSkeleton() {
  return (
    <div className="space-y-4">
      <div className="toolbar">
        <div className="h-7 w-48 rounded bg-slate-800/70" />
        <div className="ml-auto h-7 w-64 rounded bg-slate-800/70" />
        <div className="h-7 w-24 rounded bg-slate-800/70" />
      </div>
      <div className="card h-20" />
      <div className="card h-64" />
    </div>
  );
}
