import { useTranslations } from 'next-intl';
import { Link } from '../i18n/navigation';

export default function NotFoundPage() {
  const t = useTranslations('NotFound');
  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <h1 className="text-4xl font-bold mb-4">{t('title')}</h1>
      <p className="text-xl mb-8">{t('message')}</p>
      <Link
        href="/"
        className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors"
      >
        {t('goHome')}
      </Link>
    </div>
  );
}
