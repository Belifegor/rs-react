import { useState, useEffect, useMemo } from "react";
import type { Co2Dataset } from "./types/co2";
import "./App.css";

export default function App() {
  const [data, setData] = useState<Co2Dataset | null>(null);
  const [error, setError] = useState<string>("");
  const [selectedYear, setSelectedYear] = useState<number | null>(null);
  const [search, setSearch] = useState<string>("");

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

  const normalizedSearch = search.trim().toLowerCase();

  const countries = useMemo(() => {
    if (!data) return [];
    const names = Object.keys(data);
    const filtered = normalizedSearch
      ? names.filter((n) => n.toLowerCase().includes(normalizedSearch))
      : names;
    return filtered.sort((a, b) => a.localeCompare(b));
  }, [data, normalizedSearch]);

  if (error) return <div className="error">Error: {error}</div>;
  if (!data || selectedYear === null)
    return <div className="loading">Loading...</div>;

  const hasResults = countries.length > 0;
  const first = hasResults ? countries[0] : "";
  const rows = hasResults ? (data[first] ?? []) : [];
  const allYears = hasResults
    ? [...new Set(rows.map((r) => r.year))].sort((a, b) => a - b)
    : [];
  const current = hasResults
    ? rows.find((r) => r.year === selectedYear)
    : undefined;

  return (
    <div className="App">
      <h1>CO₂ Emissions Data</h1>

      <div style={{ marginBottom: 12 }}>
        <input
          placeholder="Search country…"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <span style={{ marginLeft: 8, opacity: 0.8 }}>
          Found: {countries.length}
        </span>
      </div>

      {hasResults && (
        <label>
          Year:&nbsp;
          <select
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
      )}

      {!hasResults ? (
        <p style={{ marginTop: 24 }}>No results for “{search}”.</p>
      ) : (
        <>
          <p>Total countries in dataset: {Object.keys(data).length}</p>
          <p>
            Population of {first} in {selectedYear}:{" "}
            {current?.population ?? "N/A"}
          </p>

          <ul>
            {countries.map((name) => (
              <li key={name}>{name}</li>
            ))}
          </ul>

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
                  <td>{r.co2PerCapita ?? "N/A"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </>
      )}
    </div>
  );
}
