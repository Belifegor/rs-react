import { memo } from "react";

type CountryData = {
  name: string;
  iso?: string;
  population?: number | null;
};

type Props = {
  countries: CountryData[];
  active: string;
  onSelect: (name: string) => void;
};

function CountryListBase({ countries, active, onSelect }: Props) {
  return (
    <ul className="space-y-1">
      {countries.map(({ name, iso, population }) => {
        const isActive = name === active;
        return (
          <li key={name}>
            <button
              type="button"
              onClick={() => onSelect(name)}
              className={`list-item w-full text-left ${isActive ? "list-item--active" : ""}`}
              aria-current={isActive ? "true" : "false"}
            >
              <div className="flex justify-between items-center">
                <div>
                  <span className="font-semibold text-slate-100">{name}</span>
                  {iso && <span className="ml-2 text-slate-400">({iso})</span>}
                </div>

                <span className="text-sm text-slate-300">
                  {population != null
                    ? population.toLocaleString("en-US")
                    : "N/A"}
                </span>
              </div>
            </button>
          </li>
        );
      })}
    </ul>
  );
}

export const CountryList = memo(CountryListBase);
