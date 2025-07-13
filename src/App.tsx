import './App.css';
import { Component } from 'react';

type Person = {
  name: string;
  birth_year: string;
  gender: string;
  height: string;
  mass: string;
};

type SwapiResponse = {
  count: number;
  next: string | null;
  previous: string | null;
  results: Person[];
};

type AppState = {
  searchTerm: string;
  loading: boolean;
  results: Person[];
  error: string | null;
};

class App extends Component<object, AppState> {
  constructor(props: object) {
    super(props);
    this.state = {
      searchTerm: '',
      loading: false,
      results: [],
      error: null,
    };
  }

  componentDidMount(): void {
    const savedTerm = localStorage.getItem('search') || '';
    this.setState({ searchTerm: savedTerm }, () => {
      this.fetchData(savedTerm);
    });
  }

  fetchData = (term: string) => {
    const query = term.trim().toLowerCase();

    const baseUrl = `https://swapi.info/api/people`;
    const url = query ? `${baseUrl}/?search=${query}` : baseUrl;

    this.setState({ loading: true, error: null });

    fetch(url)
      .then((response) => {
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        return response.json();
      })
      .then((data: SwapiResponse) => {
        this.setState({ results: data.results, loading: false });
      })
      .catch((error) => {
        this.setState({ error: error.message, loading: false });
      });
  };

  render() {
    const { searchTerm, results, loading, error } = this.state;

    return (
      <div>
        <h1>Star Wars Characters</h1>
        <p>
          Search Term: <strong>{searchTerm}</strong>
        </p>

        {loading && <p>Loading...</p>}
        {error && <p style={{ color: 'red' }}>Error: {error}</p>}

        <ul>
          {results.map((person) => (
            <li key={person.name}>
              <strong>{person.name}</strong> — {person.birth_year},{' '}
              {person.gender}
            </li>
          ))}
        </ul>
      </div>
    );
  }
}

export default App;
