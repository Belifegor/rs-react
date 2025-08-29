import { memo } from "react";

type Props = {
  countries: string[];
  active: string;
  onSelect: (name: string) => void;
};

function CountryListBase({ countries, active, onSelect }: Props) {
  return (
    <ul className="space-y-1">
      {countries.map((name) => {
        const isActive = name === active;
        return (
          <li key={name}>
            <button
              type="button"
              onClick={() => onSelect(name)}
              className={`list-item ${isActive ? "list-item--active" : ""}`}
              aria-current={isActive ? "true" : "false"}
            >
              {name}
            </button>
          </li>
        );
      })}
    </ul>
  );
}

export const CountryList = memo(CountryListBase);
