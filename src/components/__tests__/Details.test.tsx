import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { describe, it, expect, vi, afterEach } from 'vitest';
import Details from '../Details';
import * as router from 'react-router-dom';

vi.mock('react-router-dom', async () => {
  const actual =
    await vi.importActual<typeof import('react-router-dom')>(
      'react-router-dom'
    );
  return {
    ...actual,
    useNavigate: vi.fn(),
    useParams: vi.fn(),
  };
});

afterEach(() => {
  vi.restoreAllMocks();
});

describe('Details', () => {
  it('показывает лоадер', () => {
    (router.useParams as unknown as vi.Mock).mockReturnValue({
      detailsId: '1',
      page: '3',
    });
    globalThis.fetch = vi.fn(() => new Promise(() => {})) as typeof fetch;
    render(
      <MemoryRouter>
        <Details />
      </MemoryRouter>
    );
    expect(screen.getByText(/progress/i)).toBeInTheDocument();
  });

  it('показывает ошибку и вызывает navigate при ошибке', async () => {
    const mockNavigate = vi.fn();
    (router.useNavigate as unknown as vi.Mock).mockReturnValue(mockNavigate);
    (router.useParams as unknown as vi.Mock).mockReturnValue({
      detailsId: '1',
      page: '3',
    });
    globalThis.fetch = vi.fn(() =>
      Promise.resolve({
        ok: false,
        json: () => Promise.resolve({}),
      } as unknown as Response)
    ) as typeof fetch;

    render(
      <MemoryRouter>
        <Details />
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(screen.getByText(/error/i)).toBeInTheDocument();
    });

    expect(mockNavigate).toHaveBeenCalledWith('/not-found');
  });

  it('отображает персонажа и кнопка закрытия работает', async () => {
    const mockNavigate = vi.fn();
    (router.useNavigate as unknown as vi.Mock).mockReturnValue(mockNavigate);
    (router.useParams as unknown as vi.Mock).mockReturnValue({
      detailsId: '1',
      page: '3',
    });
    globalThis.fetch = vi.fn(() =>
      Promise.resolve({
        ok: true,
        json: () =>
          Promise.resolve({
            id: 1,
            name: 'Rick Sanchez',
            image: '/rick.png',
            status: 'Alive',
            species: 'Human',
            gender: 'Male',
          }),
      } as unknown as Response)
    ) as typeof fetch;

    render(
      <MemoryRouter>
        <Details />
      </MemoryRouter>
    );

    expect(await screen.findByText('Rick Sanchez')).toBeInTheDocument();
    fireEvent.click(screen.getByRole('button', { name: /close details/i }));
    expect(mockNavigate).toHaveBeenCalledWith('/3');
  });

  it('возвращает null если нет detailsId', () => {
    (router.useParams as unknown as vi.Mock).mockReturnValue({ page: '1' });

    const { container } = render(
      <MemoryRouter>
        <Details />
      </MemoryRouter>
    );
    expect(container.innerHTML).toBe('');
  });
});
