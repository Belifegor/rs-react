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
  selectedColumns: string[];
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
  selectedColumns,
}: ContentProps) {
  const data = resource.read();

  const countries = useMemo(() => {
    const names = Object.keys(data);
    const filtered = normalizedSearch
      ? names.filter((n) => n.toLowerCase().includes(normalizedSearch))
      : names;

    const enrichedCountries = filtered.map((name) => {
      const entry = (data as Co2Dataset)[name];
      const countryRows = getRows(entry);
      let population: number | undefined | null = null;

      const yearToFind = selectedYear ?? countryRows.at(-1)?.year;

      if (yearToFind) {
        population = countryRows.find((r) => r.year === yearToFind)?.population;
      }

      return {
        name,
        population: population ?? null,
        iso: getIso(entry),
      };
    });

    enrichedCountries.sort((a, b) => {
      if (sortBy === "name") {
        const cmp = a.name.localeCompare(b.name);
        return sortDir === "asc" ? cmp : -cmp;
      }

      if (a.population === null && b.population === null) return 0;
      if (a.population === null) return 1;
      if (b.population === null) return -1;

      const cmp = a.population - b.population;
      return sortDir === "asc" ? cmp : -cmp;
    });

    return enrichedCountries;
  }, [data, normalizedSearch, sortBy, sortDir, selectedYear]);

  useEffect(() => {
    setVisibleCount(20);
  }, [normalizedSearch, setVisibleCount]);

  useEffect(() => {
    if (countries.length === 0) {
      if (activeCountry !== "") onSelectCountry("");
      return;
    }

    const isCountryInList = countries.some((c) => c.name === activeCountry);

    if (!activeCountry || !isCountryInList) {
      onSelectCountry(countries[0].name);
    }
  }, [countries, activeCountry, onSelectCountry]);

  const visibleCountries = useMemo(
    () => countries.slice(0, visibleCount),
    [countries, visibleCount]
  );

  const key = activeCountry || countries[0]?.name || "";

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
            <select className="select" value={sortBy} onChange={onSortByChange}>
              <option value="name">name</option>
              <option value="population">population</option>
            </select>
          </label>

          <button type="button" className="btn" onClick={onSortDirToggle}>
            {sortDir === "asc" ? "↑ desc" : "↓ asc"}
          </button>
        </div>
      </div>
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
            <CountryCard
              country={iso ? `${key} (${iso})` : key}
              selectedYear={selectedYear ?? 0}
              population={population}
              continent={continent}
            />

            <div className="card">
              <YearTable
                rows={rows}
                columns={selectedColumns as (keyof YearRecord)[]}
              />
            </div>
          </>
        ) : (
          <div className="card text-sm text-slate-300">No results.</div>
        )}
      </section>
    </div>
  );
}
