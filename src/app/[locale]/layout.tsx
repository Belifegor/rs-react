import { NextIntlClientProvider } from 'next-intl';
import Providers from './providers';
import './../globals.css';
import './../index.css';
import { notFound } from 'next/navigation';
import { locales, type Locale } from '../../i18n/routing';

function isValidLocale(locale: string): locale is Locale {
  return locales.includes(locale as Locale);
}

export default async function RootLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: { locale: string };
}) {
  const { locale } = await params;

  if (!isValidLocale(locale)) {
    notFound();
  }

  const messages = (await import(`../../../messages/${locale}.json`)).default;

  return (
    <html lang={locale}>
      <body>
        <NextIntlClientProvider locale={locale} messages={messages}>
          <Providers>{children}</Providers>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
