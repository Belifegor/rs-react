import { Component } from 'react';
import type { PropsSearch, StateSearch } from '../types/types';

class Search extends Component<PropsSearch, StateSearch> {
  state: StateSearch = {
    inputValue: this.props.initialValue,
  };

  handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    this.props.onSearch(this.state.inputValue);
  };

  handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    this.setState({ inputValue: event.target.value });
  };

  render() {
    return (
      <form
        onSubmit={this.handleSubmit}
        className="flex flex-col sm:flex-row items-center justify-center gap-4 p-4"
      >
        <input
          type="text"
          value={this.state.inputValue}
          onChange={this.handleInputChange}
          placeholder="Search for a character..."
          className="w-full sm:w-80 px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <button
          type="submit"
          className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition"
        >
          Search
        </button>
      </form>
    );
  }
}

export default Search;
