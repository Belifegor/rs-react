'use client';

import { useTranslations } from 'next-intl';
import { Link } from '../i18n/navigation';
import LanguageSwitcher from './LanguageSwitcher';
import ThemeChanger from '../context/ThemeChanger';

export default function Header() {
  const t = useTranslations('Navigation');

  return (
    <header className="w-full p-4 bg-gray-800 text-white flex justify-between items-center sticky top-0 z-20">
      <nav className="flex items-center gap-6 text-lg">
        <Link href="/">{t('home')}</Link>
        <Link href="/about">{t('about')}</Link>
      </nav>
      <div className="flex items-center gap-4">
        <LanguageSwitcher />
        <ThemeChanger />
      </div>
    </header>
  );
}
