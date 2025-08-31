import {
  useState,
  useMemo,
  useCallback,
  useDeferredValue,
  Suspense,
  Profiler,
} from "react";
import { createCo2Resource } from "./data/resource";
import { MainSkeleton } from "./components/Skeletons";
import { AppContent } from "./components/AppContent";
import { type Region } from "./data/constants";
import "./index.css";

const logProfile: React.ProfilerOnRenderCallback = (
  id,
  phase,
  actualDuration,
  baseDuration,
  startTime,
  commitTime,
) => {
  console.log({
    id,
    startTime,
    phase,
    actualDuration,
    baseDuration,
    commitTime,
  });
};

export default function App() {
  const DATA_URL =
    "https://nyc3.digitaloceanspaces.com/owid-public/data/co2/owid-co2-data.json";
  const resource = useMemo(() => createCo2Resource(DATA_URL), [DATA_URL]);

  const [selectedYear, setSelectedYear] = useState<number | null>(null);
  const [search, setSearch] = useState<string>("");
  const [sortBy, setSortBy] = useState<"name" | "population">("name");
  const [sortDir, setSortDir] = useState<"asc" | "desc">("asc");
  const [activeCountry, setActiveCountry] = useState<string>("");
  const [visibleCount, setVisibleCount] = useState(20);
  const [region, setRegion] = useState<Region>("all");

  const deferredSearch = useDeferredValue(search);
  const normalizedSearch = deferredSearch.trim().toLowerCase();

  const handleRegionChange = useCallback(
    (e: React.ChangeEvent<HTMLSelectElement>) => {
      setRegion(e.target.value as Region);
    },
    [],
  );

  const handleSelectCountry = useCallback((name: string) => {
    setActiveCountry(name);
  }, []);

  const handleSearchChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setSearch(e.target.value);
    },
    [],
  );

  const handleYearChange = useCallback(
    (e: React.ChangeEvent<HTMLSelectElement>) => {
      setSelectedYear(Number(e.target.value));
    },
    [],
  );

  const handleSortByChange = useCallback(
    (e: React.ChangeEvent<HTMLSelectElement>) => {
      setSortBy(e.target.value as "name" | "population");
    },
    [],
  );

  const handleSortDirToggle = useCallback(() => {
    setSortDir((d) => (d === "asc" ? "desc" : "asc"));
  }, []);

  return (
    <div className="mx-auto max-w-7xl p-6 space-y-4">
      <header className="sticky top-0 z-10 -mx-6 border-b border-slate-800 bg-slate-900/80 backdrop-blur">
        <div className="mx-auto max-w-7xl px-6 py-3">
          <h1>CO₂ Emissions Data</h1>
        </div>
      </header>
      <Profiler id="AppContent" onRender={logProfile}>
        <Suspense fallback={<MainSkeleton />}>
          <AppContent
            resource={resource}
            selectedYear={selectedYear}
            setSelectedYear={setSelectedYear}
            search={search}
            normalizedSearch={normalizedSearch}
            sortBy={sortBy}
            sortDir={sortDir}
            activeCountry={activeCountry}
            visibleCount={visibleCount}
            setVisibleCount={setVisibleCount}
            onSelectCountry={handleSelectCountry}
            onSearchChange={handleSearchChange}
            onYearChange={handleYearChange}
            onSortByChange={handleSortByChange}
            onSortDirToggle={handleSortDirToggle}
            region={region}
            onRegionChange={handleRegionChange}
          />
        </Suspense>
      </Profiler>
    </div>
  );
}
