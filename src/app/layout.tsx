import './globals.css';
import './index.css';
import type { Metadata } from 'next';

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
      <body>{children}</body>
    </html>
  );
}
