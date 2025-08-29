import { memo } from "react";
import type { YearRecord } from "../types/co2";

type Props = { rows: YearRecord[] };

function YearTableBase({ rows }: Props) {
  return (
    <table>
      <thead>
        <tr>
          <th>year</th>
          <th>population</th>
          <th>co2</th>
          <th>co2_per_capita</th>
        </tr>
      </thead>
      <tbody>
        {rows.map((r) => (
          <tr key={r.year}>
            <td>{r.year}</td>
            <td>{r.population ?? "N/A"}</td>
            <td>{r.co2 ?? "N/A"}</td>
            <td>{r.co2_per_capita ?? "N/A"}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}

export const YearTable = memo(YearTableBase);
