import '../src/assets/styles/App.css';
import { Outlet, Link, useLocation } from 'react-router-dom';
import Flyout from './components/Flyout ';
import { useStore } from './store/store';

export default function App() {
  // const [hasError, setHasError] = useState(false);
  const location = useLocation();
  const selected = useStore((s) => s.selected);

  if (hasError) {
    throw new Error('Simulated error');
  }

  return (
    <div className="flex gap-4 min-h-screen">
      <div className="w-full">
        <Outlet />
      </div>
      {location.pathname !== '/about' && (
        <Link
          to="/about"
          className="fixed top-4 right-4 px-4 py-2 bg-amber-600 text-white rounded hover:bg-amber-500 z-10"
        >
          About
        </Link>
      )}
      {/* <button
        onClick={() => setHasError(true)}
        className="fixed bottom-5 right-5 px-4 py-2 bg-red-800 text-white rounded-md hover:bg-red-700 transition-colors"
      >
        Simulate Error
      </button> */}
      {selected.length > 0 && <Flyout />}
    </div>
  );
}
