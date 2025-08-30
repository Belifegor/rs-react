import { memo, useRef, useState, useEffect } from "react";

type Props = {
  country: string;
  selectedYear: number;
  population?: number;
  continent?: string;
};

function CountryCardBase({
  country,
  selectedYear,
  population,
  continent,
}: Props) {
  const prevYear = useRef(selectedYear);
  const [flash, setFlash] = useState(false);

  useEffect(() => {
    if (prevYear.current !== null && prevYear.current !== selectedYear) {
      setFlash(true);
      const id = setTimeout(() => setFlash(false), 500);
      prevYear.current = selectedYear;
      return () => clearTimeout(id);
    }
    prevYear.current = selectedYear;
  }, [selectedYear]);

  return (
    <div className="card">
      <h2 className="mb-1 text-xl font-semibold text-slate-100">{country}</h2>
      {continent && (
        <div className="text-sm text-slate-400">Continent: {continent}</div>
      )}
      <div className={`text-sm text-slate-300 ${flash ? "flash" : ""}`}>
        Population in {selectedYear}:{" "}
        <span className="font-medium text-slate-50">{population ?? "N/A"}</span>
      </div>
    </div>
  );
}

export const CountryCard = memo(CountryCardBase);
