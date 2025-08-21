'use client';

import { useLocale } from 'next-intl';
import { useRouter } from 'next/navigation';
import { useTransition, ChangeEvent } from 'react';

export default function LanguageSwitcher() {
  const [isPending, startTransition] = useTransition();
  const router = useRouter();
  const locale = useLocale();

  const onSelectChange = (e: ChangeEvent<HTMLSelectElement>) => {
    const nextLocale = e.target.value;
    startTransition(() => {
      router.replace(`/${nextLocale}`);
    });
  };

  return (
    <label className="relative text-gray-400">
      <select
        className="inline-flex appearance-none bg-transparent py-3 pl-2 pr-6 text-sm font-medium focus:outline-none"
        defaultValue={locale}
        onChange={onSelectChange}
        disabled={isPending}
      >
        <option value="en">English</option>
        <option value="ru">Русский</option>
      </select>
      <span className="pointer-events-none absolute right-2 top-1/2 -translate-y-1/2">
        ⌄
      </span>
    </label>
  );
}
