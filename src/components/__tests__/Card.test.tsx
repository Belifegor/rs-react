import { render, screen } from '@testing-library/react';
import Card from '../Card';
import { MemoryRouter } from 'react-router-dom';

const mockChar = {
  id: 1,
  name: 'Rick Sanchez',
  status: 'Alive',
  species: 'Human',
  gender: 'Male',
  image: 'rick.png',
};

describe('Card component', () => {
  it('renders character image', () => {
    render(
      <MemoryRouter>
        <Card character={mockChar} />
      </MemoryRouter>
    );
    const image = screen.getByRole('img', { name: /rick sanchez/i });
    expect(image).toBeInTheDocument();
    expect(image).toHaveAttribute('src', 'rick.png');
  });

  it('renders character name, species, and gender', () => {
    render(
      <MemoryRouter>
        <Card character={mockChar} />
      </MemoryRouter>
    );
    expect(screen.getByText(/rick sanchez/i)).toBeInTheDocument();
    expect(screen.getByText(/human, male/i)).toBeInTheDocument();
  });
});
