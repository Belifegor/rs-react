'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ThemeChanger } from './utils/ThemeChanger';
import './app/globals.css';

export default function App({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  return (
    <div className="flex gap-4 min-h-screen m-auto dark:text-white dark:bg-gray-900">
      {children}

      {pathname !== '/about' && (
        <Link
          href="/about"
          className="fixed top-4 right-4 px-4 py-2 bg-amber-600 text-white rounded hover:bg-amber-500 z-10"
        >
          About
        </Link>
      )}

      <ThemeChanger />
    </div>
  );
}
