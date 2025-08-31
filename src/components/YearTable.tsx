import { memo, useRef, useMemo } from "react";
import { useVirtualizer } from "@tanstack/react-virtual";
import type { YearRecord } from "../types/co2";

type Props = {
  rows: YearRecord[];
  columns?: (keyof YearRecord)[];
  height?: number;
  rowHeight?: number;
};

const columnClass = "flex-1 text-center px-2 py-1.5 whitespace-nowrap";

function prettyHeader(key: string) {
  return key.replaceAll("_", " ");
}

function fmt(value: YearRecord[keyof YearRecord]) {
  if (typeof value === "number") return value.toLocaleString();
  if (typeof value === "string") return value;
  return "N/A";
}

export const YearTable = memo(function YearTable({
  rows,
  columns,
  height = 400,
  rowHeight = 35,
}: Props) {
  const cols = useMemo<(keyof YearRecord)[]>(
    () =>
      columns && columns.length
        ? columns
        : ([
            "year",
            "population",
            "co2",
            "co2_per_capita",
          ] as (keyof YearRecord)[]),
    [columns],
  );

  const parentRef = useRef<HTMLDivElement>(null);

  const rowVirtualizer = useVirtualizer({
    count: rows.length,
    getScrollElement: () => parentRef.current,
    estimateSize: () => rowHeight,
    overscan: 5,
    getItemKey: (i) => rows[i].year,
  });

  if (!rows.length) {
    return (
      <div className="card text-sm text-slate-300">No data available.</div>
    );
  }

  return (
    <div className="card p-0 overflow-hidden">
      <div className="flex bg-slate-800/50 font-semibold text-xs uppercase tracking-wider text-slate-300">
        {cols.map((colKey) => (
          <div key={colKey as string} className={columnClass}>
            {prettyHeader(colKey as string)}
          </div>
        ))}
      </div>

      <div
        ref={parentRef}
        className="overflow-y-auto scrollbar"
        style={{ height }}
      >
        <div
          style={{
            height: rowVirtualizer.getTotalSize(),
            width: "100%",
            position: "relative",
          }}
        >
          {rowVirtualizer.getVirtualItems().map((vi) => {
            const row = rows[vi.index];
            return (
              <div
                key={vi.key}
                className="flex border-b border-slate-800 text-sm"
                style={{
                  position: "absolute",
                  top: 0,
                  left: 0,
                  width: "100%",
                  height: vi.size,
                  transform: `translateY(${vi.start}px)`,
                }}
              >
                {cols.map((colKey) => (
                  <div key={colKey as string} className={columnClass}>
                    {fmt(row[colKey])}
                  </div>
                ))}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
});
