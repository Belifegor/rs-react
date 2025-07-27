import { useNavigate, useParams } from 'react-router-dom';
import CharacterPage from '../pages/CharacterPage';
import Details from './Details';

export default function MasterDetailWrapper() {
  const navigate = useNavigate();
  const { page = '1' } = useParams();

  return (
    <div className="flex w-full min-h-screen">
      <div
        className="flex-grow"
        onClick={() => navigate(`/${page}`)}
        style={{ cursor: 'pointer' }}
        tabIndex={0}
        role="button"
        aria-label="Close details"
      >
        <CharacterPage />
      </div>
      <div className="w-1/3 p-4 overflow-y-auto m-auto">
        <Details />
      </div>
    </div>
  );
}
