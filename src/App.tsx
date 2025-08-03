import '../src/assets/styles/App.css';
import { Outlet, Link, useLocation } from 'react-router-dom';

export default function App() {
  const location = useLocation();

  return (
    <div className="flex gap-4 min-h-screen m-auto">
      <Outlet />
      {location.pathname !== '/about' && (
        <Link
          to="/about"
          className="fixed top-4 right-4 px-4 py-2 bg-amber-600 text-white rounded hover:bg-amber-500 z-10"
        >
          About
        </Link>
      )}
    </div>
  );
}
