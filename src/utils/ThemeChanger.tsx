import { useTheme } from '../hooks/useTheme';

export function ThemeChanger() {
  const { theme, setTheme } = useTheme();

  const nextTheme = theme === 'light' ? 'dark' : 'light';
  const icon = nextTheme === 'dark' ? '🌙' : '🔦';
  const label = nextTheme === 'dark' ? 'Dark' : 'Light';

  return (
    <button
      className="fixed top-3 right-25 px-4 py-2 z-10 rounded bg-slate-700 text-white hover:bg-slate-600 transition"
      onClick={() => setTheme(nextTheme)}
    >
      {icon} {label}
    </button>
  );
}
