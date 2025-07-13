import './App.css';
import { Component } from 'react';
import Search from './components/Search';

type Character = {
  id: number;
  name: string;
  status: string;
  species: string;
  gender: string;
  image: string;
};

type RMResponse = {
  info: {
    count: number;
    pages: number;
    next: string | null;
    prev: string | null;
  };
  results: Character[];
};

type AppState = {
  searchTerm: string;
  loading: boolean;
  results: Character[];
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

    const url = query
      ? `https://rickandmortyapi.com/api/character/?name=${query}`
      : `https://rickandmortyapi.com/api/character`;

    this.setState({ loading: true, error: null });

    fetch(url)
      .then((response) => {
        if (!response.ok) {
          throw new Error('Character not found');
        }
        return response.json();
      })
      .then((data: RMResponse) => {
        this.setState({
          results: data.results,
          searchTerm: term,
          loading: false,
        });
      })
      .catch((error) => {
        this.setState({ error: error.message, loading: false });
      });
  };

  render() {
    const { searchTerm, results, loading, error } = this.state;

    return (
      <>
        <Search onSearch={this.fetchData} />
         <div>
          <h1>Rick and Morty Characters</h1> {/* ✅ CHANGED title */}

          <p>
            Search Term: <strong>{searchTerm}</strong>
          </p>

          {loading && <p>Loading...</p>}
          {error && <p style={{ color: 'red' }}>Error: {error}</p>}

          <ul style={{ listStyle: 'none', padding: 0 }}>
            {results.map((char) => (
              <li key={char.id} style={{ marginBottom: '12px' }}>
                <img
                  src={char.image}
                  alt={char.name}
                  width="50"
                  style={{ verticalAlign: 'middle', marginRight: '10px' }}
                />
                <strong>{char.name}</strong> – {char.species}, {char.gender}
              </li>
            ))}
          </ul>
        </div>
      </>
    );
  }
}

export default App;
