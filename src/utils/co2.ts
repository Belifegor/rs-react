import type { YearRecord } from "../types/co2";

export function getPopulationForYear(
  rows: YearRecord[],
  year: number,
): number | undefined {
  const rec = rows.find((r) => r.year === year);
  return rec?.population;
}
