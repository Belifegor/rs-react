import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import About from '../../pages/AboutPage';

describe('About', () => {
  it('корректно отображает информацию об авторе', () => {
    render(
      <MemoryRouter>
        <About />
      </MemoryRouter>
    );

    expect(screen.getByText(/About the Author/i)).toBeInTheDocument();
    expect(screen.getByText(/Alexandr Belifegor/i)).toBeInTheDocument();
    expect(screen.getByText(/Front-End Developer/i)).toBeInTheDocument();
    expect(
      screen.getByRole('link', { name: /GitHub Profile/i })
    ).toHaveAttribute('href', 'https://github.com/belifegor');
    expect(screen.getByRole('link', { name: /RS School/i })).toHaveAttribute(
      'href',
      'https://rs.school/courses/reactjs'
    );
    expect(
      screen.getByText(/Still learning, still building, still dreaming/i)
    ).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /Back to Home/i })).toHaveAttribute(
      'href',
      '/'
    );
  });
});
