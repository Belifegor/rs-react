import { render, screen } from '@testing-library/react';
import Card from '../Card';

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
    render(<Card character={mockChar} />);
    const image = screen.getByRole('img', { name: /rick sanchez/i });
    expect(image).toBeInTheDocument();
    expect(image).toHaveAttribute('src', 'rick.png');
  });

  it('renders character name, species, and gender', () => {
    render(<Card character={mockChar} />);
    expect(screen.getByText(/rick sanchez/i)).toBeInTheDocument();
    expect(screen.getByText(/human, male/i)).toBeInTheDocument();
  });
});
