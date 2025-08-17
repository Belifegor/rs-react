import './globals.css';

export const metadata = {
  title: '404 - Page Not Found',
  description: 'The page you are looking for does not exist.',
};

export default function GlobalNotFound() {
  return (
    <html lang="en">
      <body>
        <div className="flex min-h-screen flex-col items-center justify-center bg-gray-800 text-red-700">
          <h1 className="text-4xl font-bold mb-4">404 - Page Not Found</h1>
          <p className="mb-6 text-white-500">
            Sorry, this page does not exist.
          </p>
          <a
            href="/"
            className="px-4 py-2 bg-orange-700 text-white rounded hover:bg-blue-700"
          >
            Go Home
          </a>
        </div>
      </body>
    </html>
  );
}
