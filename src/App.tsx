import '../src/assets/styles/App.css';
import { Component } from 'react';
import Search from './components/Search';
import type { AppState } from './types/types';
import Card from './components/Card';
import { fetchCharacters, fetchPageData } from './api/rickAndMorty';

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

    this.setState({ loading: true, error: null });

    fetchCharacters(query)
      .then((data) => {
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

  fetchPage = (url: string) => {
    this.setState({ loading: true, error: null });

    fetchPageData(url)
      .then((data) => {
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
  throwError = () => {
    this.setState({ hasError: true });
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
          <div className="grid grid-cols-1 sm:grid-cols-4 sm:gap-6">
            {results.map((char) => (
              <Card key={char.id} character={char} />
            ))}
          </div>
          <button
            onClick={this.throwError}
            className="mt-5 px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors"
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
