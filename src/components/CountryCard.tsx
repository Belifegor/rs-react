import { memo } from "react";

type Props = {
  country: string;
  selectedYear: number;
  population?: number;
};

function CountryCardBase({ country, selectedYear, population }: Props) {
  return (
    <div className="card">
      <h2 className="mb-1 text-slate-100">{country}</h2>
      <div className="text-sm text-slate-300">
        Population in {selectedYear}:{" "}
        <span className="font-medium text-slate-50">{population ?? "N/A"}</span>
      </div>
    </div>
  );
}

export const CountryCard = memo(CountryCardBase);