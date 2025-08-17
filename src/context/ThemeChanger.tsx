'use client';
import { useTheme } from '@/hooks/useTheme';

export default function ThemeChanger() {
  const { theme, toggleTheme } = useTheme();

  if (!theme) return null;

  const icon = theme === 'light' ? '🌙' : '☀️';
  const label = theme === 'light' ? 'Dark' : 'Light';

  return (
    <button
      className="px-4 py-2 rounded bg-slate-700 text-white hover:bg-slate-600 transition"
      onClick={toggleTheme}
    >
      {icon} {label}
    </button>
  );
}
