import '../src/assets/styles/App.css';
import { useState } from 'react';
import { Outlet } from 'react-router';

export default function App() {
  const [hasError, setHasError] = useState(false);

  if (hasError) {
    throw new Error('Simulated error');
  }

  return (
    <div className="flex gap-4 min-h-screen">
      <div className="w-full">
        <Outlet />
      </div>
      <button
        onClick={() => setHasError(true)}
        className="fixed bottom-5 right-5 px-4 py-2 bg-red-800 text-white rounded-md hover:bg-red-700 transition-colors"
      >
        Simulate Error
      </button>
    </div>
  );
}
