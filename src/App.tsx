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
  nextPage: string | null;
  prevPage: string | null;
  hasError: boolean;
};

class App extends Component<object, AppState> {
  constructor(props: object) {
    super(props);
    this.state = {
      searchTerm: '',
      loading: false,
      results: [],
      error: null,
      nextPage: null,
      prevPage: null,
      hasError: false,
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
          nextPage: data.info.next,
          prevPage: data.info.prev,
          loading: false,
        });
      })
      .catch((error) => {
        this.setState({ error: error.message, loading: false });
      });
  };

  throwError = () => {
    this.setState({ hasError: true });
  };

  fetchPage = (url: string) => {
    this.setState({ loading: true, error: null });

    fetch(url)
      .then((response) => {
        if (!response.ok) {
          throw new Error('Failed to fetch page');
        }
        return response.json();
      })
      .then((data: RMResponse) => {
        this.setState({
          results: data.results,
          nextPage: data.info.next,
          prevPage: data.info.prev,
          loading: false,
        });
      })
      .catch((error) => {
        this.setState({ error: error.message, loading: false });
      });
  };

  render() {
    const { searchTerm, results, loading, error } = this.state;

    if (this.state.hasError) {
      throw new Error('Simulate error');
    }

    return (
      <>
        <Search onSearch={this.fetchData} />
        <div>
          <h1>Rick and Morty Characters</h1>
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
          <button
            onClick={this.throwError}
            style={{
              marginTop: '20px',
              padding: '8px 16px',
              backgroundColor: 'crimson',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer',
            }}
          >
            Simulate Error
          </button>
          <div style={{ marginTop: '1rem' }}>
            {this.state.prevPage && (
              <button
                onClick={() => {
                  if (this.state.prevPage) {
                    this.fetchPage(this.state.prevPage);
                  }
                }}
              >
                Previous
              </button>
            )}
            {this.state.nextPage && (
              <button
                onClick={() => {
                  if (this.state.nextPage) {
                    this.fetchPage(this.state.nextPage);
                  }
                }}
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
}

export default App;
