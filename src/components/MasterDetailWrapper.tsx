import { useParams } from 'react-router-dom';
import CharacterPage from '../pages/CharacterPage';
import Details from './Details';

export default function MasterDetailWrapper() {
  // const navigate = useNavigate();
  const { detailsId } = useParams();

  return (
    <div className="flex min-h-screen w-full">
      {/* Контейнер с сеткой */}
      <div className="flex-1 flex justify-center">
        <div className="max-w-5xl w-full px-4">
          <CharacterPage />
        </div>
      </div>
      {/* Панель деталей */}
      {detailsId && (
        <div className="w-96 p-4  mt-64">
          <Details />
        </div>
      )}
    </div>
  );
}
