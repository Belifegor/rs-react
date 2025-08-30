import { useEffect, useMemo, useCallback } from "react";
import type { Dispatch, SetStateAction } from "react";
import type { Co2Dataset, YearRecord } from "../types/co2";
import { getRows, getIso, getContinent } from "../utils/co2";
import { createCo2Resource } from "../data/resource";
import { YearTable } from "./YearTable";
import { CountryCard } from "./CountryCard";
import { CountryList } from "./CountryList";

type ContentProps = {
  resource: ReturnType<typeof createCo2Resource>;
  selectedYear: number | null;
  setSelectedYear: (y: number) => void;
  search: string;
  normalizedSearch: string;
  sortBy: "name" | "population";
  sortDir: "asc" | "desc";
  activeCountry: string;
  visibleCount: number;
  setVisibleCount: Dispatch<SetStateAction<number>>;
  onSelectCountry: (name: string) => void;
  onSearchChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onYearChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  onSortByChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  onSortDirToggle: () => void;
};

export function AppContent({
  resource,
  selectedYear,
  setSelectedYear,
  search,
  normalizedSearch,
  sortBy,
  sortDir,
  activeCountry,
  visibleCount,
  setVisibleCount,
  onSelectCountry,
  onSearchChange,
  onYearChange,
  onSortByChange,
  onSortDirToggle,
}: ContentProps) {
  const data = resource.read();

  const countries = useMemo(() => {
    const names = Object.keys(data);
    const filtered = normalizedSearch
      ? names.filter((n) => n.toLowerCase().includes(normalizedSearch))
      : names;

    const sorted = [...filtered].sort((a, b) => {
      if (sortBy === "name") {
        const cmp = a.localeCompare(b);
        return sortDir === "asc" ? cmp : -cmp;
      }
      if (selectedYear == null) return 0;

      const aRows = getRows((data as Co2Dataset)[a]);
      const bRows = getRows((data as Co2Dataset)[b]);
      const aPop = aRows.find((r) => r.year === selectedYear)?.population;
      const bPop = bRows.find((r) => r.year === selectedYear)?.population;

      if (aPop == null && bPop == null) {
        const byName = a.localeCompare(b);
        return sortDir === "asc" ? byName : -byName;
      }
      if (aPop == null) return 1;
      if (bPop == null) return -1;

      const cmp = aPop - bPop;
      return sortDir === "asc" ? cmp : -cmp;
    });

    return sorted;
  }, [data, normalizedSearch, sortBy, sortDir, selectedYear]);

  useEffect(() => {
    setVisibleCount(20);
  }, [normalizedSearch, setVisibleCount]);

  useEffect(() => {
    if (countries.length === 0) {
      if (activeCountry !== "") onSelectCountry("");
      return;
    }
    if (!activeCountry || !countries.includes(activeCountry)) {
      onSelectCountry(countries[0]);
    }
  }, [countries, activeCountry, onSelectCountry]);

  const visibleCountries = useMemo(
    () => countries.slice(0, visibleCount),
    [countries, visibleCount],
  );

  const key = activeCountry || countries[0] || "";
  // const rows = useMemo<YearRecord[]>(() => {
  //   if (!key) {
  //     return [];
  //   }
  //   const value = (data as Co2Dataset)[key];
  //   return Array.isArray(value) ? (value as YearRecord[]) : [];
  // }, [data, key]);

  const entry = useMemo(() => {
    if (!key) return undefined;
    return (data as Co2Dataset)[key];
  }, [data, key]);

  const rows = useMemo<YearRecord[]>(() => {
    if (!key) return [];
    return getRows((data as Co2Dataset)[key]);
  }, [data, key]);

  const allYears = useMemo(() => {
    if (!rows.length) return [] as number[];
    return [...new Set(rows.map((r) => r.year))].sort((a, b) => a - b);
  }, [rows]);

  useEffect(() => {
    if (selectedYear == null && allYears.length > 0) {
      setSelectedYear(allYears[allYears.length - 1]);
    }
  }, [selectedYear, allYears, setSelectedYear]);

  const population =
    selectedYear != null
      ? rows.find((r) => r.year === selectedYear)?.population
      : undefined;

  const handleShowMore = useCallback(() => {
    setVisibleCount((c: number) => Math.min(c + 20, countries.length));
  }, [countries.length, setVisibleCount]);

  const iso = getIso((data as Co2Dataset)[key]);
  const continent = getContinent(entry);

  return (
    <div className="grid grid-cols-1 gap-6 md:grid-cols-[300px,1fr]">
      <aside className="card">
        <label className="mb-1 block text-sm font-medium text-slate-300">
          Search
        </label>
        <div className="mb-3 flex items-center gap-2">
          <input
            className="input"
            placeholder="Search country…"
            value={search}
            onChange={onSearchChange}
          />
          <span className="muted whitespace-nowrap">{`Found: ${countries.length}`}</span>
        </div>

        <CountryList
          countries={visibleCountries}
          active={key}
          onSelect={onSelectCountry}
        />

        <div className="mt-3 flex items-center justify-between">
          <span className="text-xs text-slate-400">
            Showing {Math.min(visibleCountries.length, countries.length)} of{" "}
            {countries.length}
          </span>
          <button
            type="button"
            className="btn"
            onClick={handleShowMore}
            disabled={visibleCountries.length >= countries.length}
          >
            Show more
          </button>
        </div>
      </aside>

      <section className="space-y-4">
        {countries.length ? (
          <>
            <div className="toolbar">
              <label className="flex items-center gap-2 text-sm">
                <span className="muted">Year</span>
                <select
                  className="select"
                  value={selectedYear ?? ""}
                  onChange={onYearChange}
                >
                  {allYears.map((y) => (
                    <option key={y} value={y}>
                      {y}
                    </option>
                  ))}
                </select>
              </label>

              <div className="ml-auto flex items-center gap-3">
                <label className="flex items-center gap-2 text-sm">
                  <span className="muted">Sort by</span>
                  <select
                    className="select"
                    value={sortBy}
                    onChange={onSortByChange}
                  >
                    <option value="name">name</option>
                    <option value="population">population</option>
                  </select>
                </label>

                <button type="button" className="btn" onClick={onSortDirToggle}>
                  {sortDir === "asc" ? "↑ desc" : "↓ asc"}
                </button>
              </div>
            </div>

            <CountryCard
              country={iso ? `${key} (${iso})` : key}
              selectedYear={selectedYear ?? 0}
              population={population}
              continent={continent}
            />

            <div className="card">
              <YearTable rows={rows} />
            </div>
          </>
        ) : (
          <div className="card text-sm text-slate-300">No results.</div>
        )}
      </section>
    </div>
  );
}
