import { Link } from 'react-router-dom';

export default function About() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh]">
      <h1 className="text-3xl font-bold mb-4">About the Author</h1>
      <p className="mb-2">
        <b>Alexandr</b>
      </p>
      <a
        className="text-blue-500 underline"
        href="https://rs.school/react/"
        target="_blank"
        rel="noopener noreferrer"
      >
        RS School React Course
      </a>
      <Link
        to="/"
        className="mt-5 px-4 py-2 bg-blue-700 text-white rounded-md hover:bg-blue-800 transition-colors"
      >
        Go to Home
      </Link>
    </div>
  );
}
