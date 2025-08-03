import { render, screen } from '@testing-library/react';
import { MemoryRouter, Routes, Route } from 'react-router-dom';
import App from '../../App';

function MockOutlet() {
  return <div>Outlet Content</div>;
}

describe('App', () => {
  it('показывает Outlet и About-кнопку', () => {
    render(
      <MemoryRouter initialEntries={['/']}>
        <Routes>
          <Route path="*" element={<App />}>
            <Route index element={<MockOutlet />} />
          </Route>
        </Routes>
      </MemoryRouter>
    );
    expect(screen.getByText(/Outlet Content/i)).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /About/i })).toBeInTheDocument();
  });

  it('не показывает About-кнопку на странице about', () => {
    render(
      <MemoryRouter initialEntries={['/about']}>
        <Routes>
          <Route path="/" element={<App />}>
            <Route path="about" element={<MockOutlet />} />
          </Route>
        </Routes>
      </MemoryRouter>
    );
    expect(screen.getByText(/Outlet Content/i)).toBeInTheDocument();
    expect(
      screen.queryByRole('link', { name: /About/i })
    ).not.toBeInTheDocument();
  });
});
