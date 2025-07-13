import { Component } from 'react';

type Props = {
  onSearch: (query: string) => void;
};

type State = {
  inputValue: string;
};

class Search extends Component<Props, State> {
  state: State = {
    inputValue: '',
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
      <form onSubmit={this.handleSubmit}>
        <input
          type="text"
          value={this.state.inputValue}
          onChange={this.handleInputChange}
          placeholder="Search for a character..."
        />
        <button type="submit">Search</button>
      </form>
    );
  }
}

export default Search;
