import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import NotFound from '../../pages/NotFound';

describe('NotFound Component', () => {
  it('renders 404 message and home link', () => {
    render(
      <MemoryRouter>
        <NotFound />
      </MemoryRouter>
    );

    expect(screen.getByText('404 - Page Not Found')).toBeInTheDocument();

    expect(
      screen.getByText('Sorry, the page you are looking for does not exist.')
    ).toBeInTheDocument();

    const homeLink = screen.getByRole('link', { name: 'Go to Home' });
    expect(homeLink).toBeInTheDocument();
    expect(homeLink).toHaveAttribute('href', '/');
  });

  it('has correct styling classes', () => {
    render(
      <MemoryRouter>
        <NotFound />
      </MemoryRouter>
    );

    const container = screen.getByText('404 - Page Not Found').closest('div');
    expect(container).toHaveClass(
      'flex',
      'flex-col',
      'items-center',
      'justify-center',
      'min-h-screen'
    );

    const homeLink = screen.getByRole('link', { name: 'Go to Home' });
    expect(homeLink).toHaveClass(
      'px-4',
      'py-2',
      'bg-red-600',
      'text-white',
      'rounded-md'
    );
  });
});
