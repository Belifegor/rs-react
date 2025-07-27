import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import Search from '../Search';

describe('Search Component', () => {
  const mockOnSearch = vi.fn();

  beforeEach(() => {
    mockOnSearch.mockClear();
    render(<Search initialValue="" onSearch={mockOnSearch} />);
  });

  it('render input and button', () => {
    expect(
      screen.getByPlaceholderText('Search for a character...')
    ).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Search' })).toBeInTheDocument();
  });

  it('update input value on typing', async () => {
    const input = screen.getByPlaceholderText('Search for a character...');
    await userEvent.type(input, 'Morty');
    expect(input).toHaveValue('Morty');
  });

  it('call onSearch with correct value on submit', async () => {
    const input = screen.getByPlaceholderText('Search for a character...');
    const button = screen.getByRole('button', { name: 'Search' });

    await userEvent.type(input, 'Rick');
    await userEvent.click(button);

    expect(mockOnSearch).toHaveBeenCalledTimes(1);
    expect(mockOnSearch).toHaveBeenCalledWith('Rick');
  });
});
