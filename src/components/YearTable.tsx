import { memo } from "react";
import type { YearRecord } from "../types/co2";

type Props = { rows: YearRecord[] };

function YearTableBase({ rows }: Props) {
  return (
    <table className="w-full border-collapse text-sm">
      <thead className="bg-slate-800/70 text-slate-300">
        <tr>
          <th className="px-3 py-2 text-left font-medium">year</th>
          <th className="px-3 py-2 text-left font-medium">population</th>
          <th className="px-3 py-2 text-left font-medium">co2</th>
          <th className="px-3 py-2 text-left font-medium">co2_per_capita</th>
        </tr>
      </thead>
      <tbody>
        {rows.map((r) => (
          <tr
            key={r.year}
            className="odd:bg-slate-800/30 hover:bg-slate-800/50"
          >
            <td className="px-3 py-2">{r.year}</td>
            <td className="px-3 py-2">{r.population ?? "N/A"}</td>
            <td className="px-3 py-2">{r.co2 ?? "N/A"}</td>
            <td className="px-3 py-2">{r.co2_per_capita ?? "N/A"}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}

export const YearTable = memo(YearTableBase);
