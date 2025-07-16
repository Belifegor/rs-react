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

    localStorage.setItem('search', query);

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
        <Search
          onSearch={this.fetchData}
          initialValue={this.state.searchTerm}
        />
        <div>
          <h1 className="mb-4">Rick and Morty Characters</h1>
          <p className="mb-4 text-2xl text-stone-300">
            Search Term: <strong>{searchTerm}</strong>
          </p>
          {loading && <p>Loading...</p>}
          {error && <p style={{ color: 'red' }}>Error: {error}</p>}
          <div className="grid grid-cols-1 sm:grid-cols-4 gap-6">
            {results.map((char) => (
              <div
                key={char.id}
                className="bg-gray-700 shadow-md rounded-lg p-4 flex flex-col items-center"
              >
                <img
                  src={char.image}
                  alt={char.name}
                  className="w-32 h-32 object-cover rounded-full mb-4"
                />
                <h2 className="text-lg font-semibold text-center text-stone-300">
                  {char.name}
                </h2>
                <p className="text-sm text-stone-400 text-center">
                  {char.species}, {char.gender}
                </p>
              </div>
            ))}
          </div>
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
