import '../src/assets/styles/App.css';
import { useEffect, useState } from 'react';
import Search from './components/Search';
import type { Character } from './types/types';
import Card from './components/Card';
import { fetchCharacters, fetchPageData } from './api/rickAndMorty';

export default function App() {
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<Character[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [nextPage, setNextPage] = useState<string | null>(null);
  const [prevPage, setPrevPage] = useState<string | null>(null);

  useEffect(() => {
    const savedTerm = localStorage.getItem('search') || '';
    setSearchTerm(savedTerm);
    fetchData(savedTerm);
  }, []);

  const fetchData = (term: string) => {
    const query = term.trim().toLowerCase();
    localStorage.setItem('search', query);

    setLoading(true);
    setError(null);

    fetchCharacters(query)
      .then((data) => {
        setResults(data.results);
        setSearchTerm(term);
        setNextPage(data.info.next);
        setPrevPage(data.info.prev);
        setLoading(false);
      })
      .catch((error) => {
        setError(error.message);
        setLoading(false);
      });
  };

  const fetchPage = (url: string) => {
    setLoading(true);
    setError(null);

    fetchPageData(url)
      .then((data) => {
        setResults(data.results);
        setNextPage(data.info.next);
        setPrevPage(data.info.prev);
        setLoading(false);
      })
      .catch((error) => {
        setError(error.message);
        setLoading(false);
      });
  };

  return (
    <>
      <Search onSearch={fetchData} initialValue={searchTerm} />
      <div>
        <h1 className="mb-4">Rick and Morty Characters</h1>
        <p className="mb-4 text-2xl text-stone-300">
          Search Term: <strong>{searchTerm}</strong>
        </p>

        {loading && <p>Loading...</p>}
        {error && <p style={{ color: 'red' }}>Error: {error}</p>}

        <div className="grid grid-cols-1 sm:grid-cols-4 sm:gap-6">
          {results.map((char) => (
            <Card key={char.id} character={char} />
          ))}
        </div>
        <div style={{ marginTop: '1rem' }}>
          {prevPage && (
            <button onClick={() => fetchPage(prevPage)}>Previous</button>
          )}
          {nextPage && (
            <button
              onClick={() => fetchPage(nextPage)}
              style={{ marginLeft: '10px' }}
            >
              Next
            </button>
          )}
        </div>
      </div>
    </>
  );
}
