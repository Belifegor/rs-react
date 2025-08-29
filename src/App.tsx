import {
  useState,
  useEffect,
  useMemo,
  useCallback,
  useDeferredValue
} from "react";
import type { Co2Dataset, YearRecord } from "./types/co2";
import { CountryCard } from "./components/CountryCard";
import { CountryList } from "./components/CountryList";
import { YearTable } from "./components/YearTable";
import "./index.css";

export default function App() {
  const [data, setData] = useState<Co2Dataset | null>(null);
  const [error, setError] = useState<string>("");
  const [selectedYear, setSelectedYear] = useState<number | null>(null);
  const [search, setSearch] = useState<string>("");
  const [sortBy, setSortBy] = useState<"name" | "population">("name");
  const [sortDir, setSortDir] = useState<"asc" | "desc">("asc");
  const [activeCountry, setActiveCountry] = useState<string>("");

  useEffect(() => {
    let mounted = true;
    fetch("/co2-sample.json", { cache: "no-store" })
      .then((r) => {
        if (!r.ok)
          throw new Error(`Failed to fetch data: ${r.status} ${r.statusText}`);
        return r.json() as Promise<Co2Dataset>;
      })
      .then((json) => {
        if (mounted) setData(json);
      })
      .catch((e) => setError((e as Error).message));
    return () => {
      mounted = false;
    };
  }, []);

  useEffect(() => {
    if (!data) return;
    const firstCountry = Object.keys(data).sort()[0];
    const rows = data[firstCountry] ?? [];
    const years = [...new Set(rows.map((r) => r.year))].sort((a, b) => a - b);
    const latest = years[years.length - 1];
    if (latest !== undefined) setSelectedYear(latest);
  }, [data]);

  const deferredSearch = useDeferredValue(search);
  const normalizedSearch = deferredSearch.trim().toLowerCase();

  function getPopulationForYear(
    rows: YearRecord[],
    year: number,
  ): number | undefined {
    const rec = rows.find((r) => r.year === year);
    return rec?.population;
  }

  const countries = useMemo(() => {
    if (!data) return [];

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

      const aPop = getPopulationForYear(data[a] ?? [], selectedYear);
      const bPop = getPopulationForYear(data[b] ?? [], selectedYear);

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
    if (countries.length === 0) {
      if (activeCountry !== "") setActiveCountry("");
      return;
    }
    if (!activeCountry || !countries.includes(activeCountry)) {
      setActiveCountry(countries[0]);
    }
  }, [countries, activeCountry]);

  const handleSelectCountry = useCallback((name: string) => {
    setActiveCountry(name);
  }, []);

  if (error) return <div className="error">Error: {error}</div>;
  if (!data || selectedYear === null)
    return <div className="loading">Loading...</div>;

  const hasResults = countries.length > 0;
  const first = hasResults ? countries[0] : "";
  const rows = hasResults ? (data[first] ?? []) : [];
  const allYears = hasResults
    ? [...new Set(rows.map((r) => r.year))].sort((a, b) => a - b)
    : [];

  const population = getPopulationForYear(rows, selectedYear);

  return (
    <div className="mx-auto max-w-7xl p-6 space-y-4">
      <header className="sticky top-0 z-10 -mx-6 border-b border-slate-800 bg-slate-900/80 backdrop-blur">
        <div className="mx-auto max-w-7xl px-6 py-3">
          <h1>CO₂ Emissions Data</h1>
        </div>
      </header>

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
              onChange={(e) => setSearch(e.target.value)}
            />
            <span className="muted whitespace-nowrap">{`Found: ${countries.length}`}</span>
          </div>

          <div className="mt-2">
            <CountryList
              countries={countries}
              active={activeCountry}
              onSelect={handleSelectCountry}
            />
          </div>
        </aside>

        <section className="space-y-4">
          {hasResults ? (
            <>
              <div className="toolbar">
                <label className="flex items-center gap-2 text-sm">
                  <span className="muted">Year</span>
                  <select
                    className="select"
                    value={selectedYear ?? ""}
                    onChange={(e) => setSelectedYear(Number(e.target.value))}
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
                      onChange={(e) =>
                        setSortBy(e.target.value as "name" | "population")
                      }
                    >
                      <option value="name">name</option>
                      <option value="population">population</option>
                    </select>
                  </label>

                  <button
                    type="button"
                    className="btn"
                    onClick={() =>
                      setSortDir((d) => (d === "asc" ? "desc" : "asc"))
                    }
                    aria-label="toggle sort direction"
                  >
                    {sortDir === "asc" ? "↑ desc" : "↓ asc"}
                  </button>
                </div>
              </div>

              <CountryCard
                country={activeCountry}
                selectedYear={selectedYear}
                population={population}
              />

              <div className="card">
                <YearTable rows={rows} />
              </div>
            </>
          ) : (
            <div className="card text-sm text-slate-300">
              No results for “{search}”.
            </div>
          )}
        </section>
      </div>
    </div>
  );
}
