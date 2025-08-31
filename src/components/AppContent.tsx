import { useEffect, useMemo, useCallback, useState } from "react";
import type { Dispatch, SetStateAction } from "react";
import type { Co2Dataset, YearRecord } from "../types/co2";
import { getRows, getIso, getContinent } from "../utils/co2";
import { createCo2Resource } from "../data/resource";
import { YearTable } from "./YearTable";
import { CountryCard } from "./CountryCard";
import { CountryList } from "./CountryList";
import { ColumnModal } from "./ColumnModal";
import { ALLOWED_EXTRA, type Region, REGIONS } from "../data/constants";

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
  region: Region;
  onRegionChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
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
  region,
  onRegionChange,
}: ContentProps) {
  const data = resource.read();

  const [isColsOpen, setColsOpen] = useState(false);
  const [extraCols, setExtraCols] = useState<Set<keyof YearRecord>>(new Set());

  const BASE_COLS = useMemo(
    () =>
      ["year", "population", "co2", "co2_per_capita"] as (keyof YearRecord)[],
    [],
  );

  const countries = useMemo(() => {
    const names = Object.keys(data);

    const byRegion = names.filter((countryKey) => {
      if (region === "all") return true;
      const entry = (data as Co2Dataset)[countryKey];
      const c = getContinent(entry);
      if (!getIso(entry)) return false;
      return typeof c === "string" && c.toLowerCase() === region.toLowerCase();
    });

    const filtered = normalizedSearch
      ? byRegion.filter((n) => n.toLowerCase().includes(normalizedSearch))
      : byRegion;

    const enrichedCountries = filtered.map((name) => {
      const entry = (data as Co2Dataset)[name];
      const countryRows = getRows(entry);
      const yearToFind = selectedYear ?? countryRows.at(-1)?.year;
      const population =
        yearToFind != null
          ? (countryRows.find((r) => r.year === yearToFind)?.population ?? null)
          : null;

      return {
        name,
        population: population,
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
  }, [data, region, normalizedSearch, sortBy, sortDir, selectedYear]);

  useEffect(() => {
    setVisibleCount(20);
  }, [normalizedSearch, region, setVisibleCount]);

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
    [countries, visibleCount],
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

  const availableCols = useMemo<(keyof YearRecord)[]>(() => {
    const s = new Set<keyof YearRecord>();
    for (const r of rows) {
      for (const k of Object.keys(r) as (keyof YearRecord)[]) {
        if (ALLOWED_EXTRA.includes(k)) {
          s.add(k);
        }
      }
    }
    return [...s];
  }, [rows]);

  const tableColumns = useMemo<(keyof YearRecord)[]>(
    () => [...BASE_COLS, ...Array.from(extraCols)],
    [BASE_COLS, extraCols],
  );

  useEffect(() => {
    if (selectedYear == null && allYears.length > 0) {
      setSelectedYear(allYears[allYears.length - 1]);
    }
  }, [selectedYear, allYears, setSelectedYear]);

  useEffect(() => {
    setVisibleCount(20);
  }, [region, setVisibleCount]);

  const population =
    selectedYear != null
      ? rows.find((r) => r.year === selectedYear)?.population
      : undefined;

  const openColumns = useCallback(() => setColsOpen(true), []);
  const closeColumns = useCallback(() => setColsOpen(false), []);
  const toggleExtra = useCallback((key: keyof YearRecord) => {
    setExtraCols((prev) => {
      const next = new Set(prev);
      if (next.has(key)) next.delete(key);
      else next.add(key);
      return next;
    });
  }, []);
  const clearExtras = useCallback(() => setExtraCols(new Set()), []);

  const handleShowMore = useCallback(() => {
    setVisibleCount((c: number) => Math.min(c + 20, countries.length));
  }, [countries.length, setVisibleCount]);

  const iso = getIso((data as Co2Dataset)[key]);
  const continent = entry ? getContinent(entry) : undefined;

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
        <label className="flex items-center gap-2 text-sm">
          <span className="muted">Region</span>
          <select className="select" value={region} onChange={onRegionChange}>
            {REGIONS.map((r) => (
              <option key={r} value={r}>
                {r}
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
          <button type="button" className="btn" onClick={openColumns}>
            Columns{extraCols.size ? ` (+${extraCols.size})` : ""}
          </button>

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
              <YearTable rows={[...rows].reverse()} columns={tableColumns} />
            </div>
          </>
        ) : (
          <div className="card text-sm text-slate-300">No results.</div>
        )}
      </section>
      {isColsOpen && (
        <ColumnModal
          isOpen={isColsOpen}
          all={availableCols}
          selected={extraCols}
          onToggle={toggleExtra}
          onClear={clearExtras}
          onClose={closeColumns}
        />
      )}
    </div>
  );
}
