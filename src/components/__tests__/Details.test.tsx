import { render, screen, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { describe, it, expect, vi, afterEach, type Mock } from 'vitest';
import Details from '../Details';
import * as router from 'react-router-dom';
import { useCharacterDetailsQuery } from '../../hooks/useCharacterDetailsQuery';
import type { UseQueryResult } from '@tanstack/react-query';

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

vi.mock('../../hooks/useCharacterDetailsQuery', () => ({
  useCharacterDetailsQuery: vi.fn(),
}));

type Character = {
  id: number;
  name: string;
  image: string;
  status: string;
  species: string;
  gender: string;
};

const loadingState = {
  data: undefined,
  isLoading: true,
  isFetching: false,
  error: null,
} satisfies Pick<
  UseQueryResult<Character>,
  'data' | 'isLoading' | 'isFetching' | 'error'
>;

const errorState = (message: string) =>
  ({
    data: undefined,
    isLoading: false,
    isFetching: false,
    error: new Error(message),
  }) satisfies Pick<
    UseQueryResult<Character>,
    'data' | 'isLoading' | 'isFetching' | 'error'
  >;

const successState = (data: Character) =>
  ({
    data,
    isLoading: false,
    isFetching: false,
    error: null,
  }) satisfies Pick<
    UseQueryResult<Character>,
    'data' | 'isLoading' | 'isFetching' | 'error'
  >;

afterEach(() => {
  vi.restoreAllMocks();
});

describe('Details', () => {
  it('показывает лоадер', () => {
    (router.useParams as Mock).mockReturnValue({ detailsId: '1', page: '3' });
    (useCharacterDetailsQuery as unknown as Mock).mockReturnValue(loadingState);

    render(
      <MemoryRouter>
        <Details />
      </MemoryRouter>
    );

    const loadingTexts = screen.getAllByText(/loading details/i);
    expect(loadingTexts).toHaveLength(2);
  });
});

it('показывает ошибку', () => {
  (router.useParams as Mock).mockReturnValue({ detailsId: '1', page: '3' });
  (useCharacterDetailsQuery as unknown as Mock).mockReturnValue(
    errorState('Failed to load character details')
  );

  render(
    <MemoryRouter>
      <Details />
    </MemoryRouter>
  );

  expect(
    screen.getByText(/error: failed to load character details/i)
  ).toBeInTheDocument();
});

it('отображает персонажа и кнопка закрытия ведёт на страницу из params', async () => {
  const mockNavigate = vi.fn();
  (router.useNavigate as Mock).mockReturnValue(mockNavigate);
  (router.useParams as Mock).mockReturnValue({ detailsId: '1', page: '3' });

  (useCharacterDetailsQuery as unknown as Mock).mockReturnValue(
    successState({
      id: 1,
      name: 'Rick Sanchez',
      image: '/rick.png',
      status: 'Alive',
      species: 'Human',
      gender: 'Male',
    })
  );

  render(
    <MemoryRouter>
      <Details />
    </MemoryRouter>
  );

  expect(await screen.findByText('Rick Sanchez')).toBeInTheDocument();
  expect(screen.getByText(/Status:/i)).toBeInTheDocument();
  expect(screen.getByText(/Species:/i)).toBeInTheDocument();
  expect(screen.getByText(/Gender:/i)).toBeInTheDocument();

  const closeButton = screen.getByRole('button', { name: /close details/i });
  fireEvent.click(closeButton);

  expect(mockNavigate).toHaveBeenCalledWith('/3');
});

it('возвращает null если нет detailsId', () => {
  (router.useParams as Mock).mockReturnValue({ page: '1' });
  (useCharacterDetailsQuery as unknown as Mock).mockReturnValue(loadingState);

  const { container } = render(
    <MemoryRouter>
      <Details />
    </MemoryRouter>
  );

  expect(container.innerHTML).toBe('');
});
