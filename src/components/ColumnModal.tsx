import { useEffect, useRef } from "react";
import type { YearRecord } from "../types/co2";

type Props = {
  isOpen: boolean;
  all: (keyof YearRecord)[];
  selected: Set<keyof YearRecord>;
  onToggle: (key: keyof YearRecord) => void;
  onClear: () => void;
  onClose: () => void;
};

function pretty(key: string) {
  return key.replaceAll("_", " ");
}

export function ColumnModal({
  isOpen,
  all,
  selected,
  onToggle,
  onClear,
  onClose,
}: Props) {
  const firstRef = useRef<HTMLButtonElement | null>(null);

  useEffect(() => {
    if (isOpen) firstRef.current?.focus();
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Select columns"
      className="fixed inset-0 z-50 flex items-center justify-center"
    >
      <div
        className="absolute inset-0 bg-black/60"
        onClick={onClose}
        aria-hidden
      />

      <div className="relative z-10 w-[min(92vw,720px)] rounded-xl border border-slate-700 bg-slate-900 p-4 shadow-2xl">
        <div className="mb-3 flex items-center justify-between">
          <h3 className="text-base font-semibold text-slate-100">
            Select additional columns
          </h3>
          <button className="btn" onClick={onClose} ref={firstRef}>
            Close
          </button>
        </div>

        <div className="mb-3 text-sm text-slate-400">
          Base columns are always visible: <code>year</code>,{" "}
          <code>population</code>, <code>co2</code>, <code>co2_per_capita</code>
        </div>

        <div className="max-h-[50vh] overflow-y-auto rounded-lg border border-slate-800 p-3">
          {all.length === 0 ? (
            <div className="text-sm text-slate-400">
              No extra fields available for this country.
            </div>
          ) : (
            <ul className="grid grid-cols-2 gap-2 md:grid-cols-3">
              {all.map((k) => {
                const checked = selected.has(k);
                return (
                  <li key={k as string}>
                    <label className="flex cursor-pointer items-center gap-2 rounded-md border border-slate-800 bg-slate-900 px-3 py-2 hover:border-slate-700">
                      <input
                        type="checkbox"
                        className="accent-sky-400"
                        checked={checked}
                        onChange={() => onToggle(k)}
                      />
                      <span className="text-slate-200">
                        {pretty(k as string)}
                      </span>
                    </label>
                  </li>
                );
              })}
            </ul>
          )}
        </div>

        <div className="mt-3 flex items-center justify-between">
          <span className="text-xs text-slate-400">
            Selected: {selected.size}
          </span>
          <div className="flex items-center gap-2">
            <button
              className="btn"
              onClick={onClear}
              disabled={selected.size === 0}
            >
              Clear
            </button>
            <button className="btn" onClick={onClose}>
              Apply
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
