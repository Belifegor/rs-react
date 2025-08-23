import { useMemo, useRef, useState, useEffect } from 'react';
import { useCountriesStore } from '../../store/useCountriesStore';

type Props = {
  value: string;
  onChange: (v: string) => void;
  inputId?: string;
  placeholder?: string;
};

export default function CountryAutocomplete({
  value,
  onChange,
  inputId,
  placeholder,
}: Props) {
  const countries = useCountriesStore((s) => s.countries);

  const [open, setOpen] = useState(false);
  const [highlight, setHighlight] = useState(0);
  const wrapRef = useRef<HTMLDivElement>(null);

  const items = useMemo(() => {
    const q = value.trim().toLowerCase();
    if (!q) return countries.slice(0, 10);
    return countries.filter((c) => c.toLowerCase().includes(q)).slice(0, 10);
  }, [countries, value]);

  useEffect(() => {
    function onDoc(e: MouseEvent) {
      if (!wrapRef.current) return;
      if (!wrapRef.current.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener('mousedown', onDoc);
    return () => document.removeEventListener('mousedown', onDoc);
  }, []);

  function commit(val: string) {
    onChange(val);
    setOpen(false);
  }

  return (
    <div ref={wrapRef} className="relative">
      <input
        id={inputId}
        role="combobox"
        aria-expanded={open}
        aria-controls={open ? 'country-listbox' : undefined}
        value={value}
        onChange={(e) => {
          onChange(e.target.value);
          setOpen(true);
          setHighlight(0);
        }}
        onFocus={() => setOpen(true)}
        onKeyDown={(e) => {
          if (!open && (e.key === 'ArrowDown' || e.key === 'ArrowUp')) {
            setOpen(true);
            return;
          }
          if (!open) return;
          if (e.key === 'ArrowDown') {
            e.preventDefault();
            setHighlight((h) => Math.min(h + 1, items.length - 1));
          }
          if (e.key === 'ArrowUp') {
            e.preventDefault();
            setHighlight((h) => Math.max(h - 1, 0));
          }
          if (e.key === 'Enter') {
            e.preventDefault();
            if (items[highlight]) commit(items[highlight]);
          }
          if (e.key === 'Escape') {
            setOpen(false);
          }
          if (e.key === 'Tab') {
            setOpen(false);
          }
        }}
        className="mt-1 w-full rounded-md bg-neutral-800 px-3 py-2 text-neutral-100 outline-none ring-1 ring-neutral-700 focus:ring-emerald-500"
        placeholder={placeholder ?? 'Start typing a country'}
        autoComplete="off"
      />

      {open && items.length > 0 && (
        <ul
          id="country-listbox"
          role="listbox"
          className="absolute z-10 mt-1 max-h-56 w-full overflow-auto rounded-md bg-neutral-800 ring-1 ring-neutral-700 shadow-lg"
        >
          {items.map((c, i) => (
            <li
              key={c}
              role="option"
              aria-selected={i === highlight}
              onMouseDown={(e) => e.preventDefault()}
              onClick={() => commit(c)}
              onMouseEnter={() => setHighlight(i)}
              className={`cursor-pointer px-3 py-2 text-sm ${
                i === highlight ? 'bg-neutral-700' : ''
              }`}
            >
              {c}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
