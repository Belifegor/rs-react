import { useParams } from 'react-router-dom';
import CharacterPage from '../pages/CharacterListPage';
import Details from './Details';

export default function MasterDetailWrapper() {
  const { detailsId } = useParams();

  return (
    <div className="flex min-h-screen w-full">
      <div className="flex justify-center">
        <div className="max-w-5xl w-full px-4">
          <CharacterPage />
        </div>
      </div>
      {detailsId && (
        <div className="w-96 p-4  mt-56">
          <Details />
        </div>
      )}
    </div>
  );
}
