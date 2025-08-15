import './globals.css';
import './index.css';
import type { Metadata } from 'next';
import Providers from '@/app/providers';

export const metadata: Metadata = {
  title: 'Rick and Morty',
  description: 'Explore characters from the multiverse',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
