import { describe, it, expect, vi, afterEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import MasterDetailWrapper from '../MasterDetailWrapper';
import type { Mock } from 'vitest';

vi.mock('../../pages/CharacterListPage', () => ({
  default: () => <div data-testid="character-page">CharacterPage</div>,
}));
vi.mock('../Details', () => ({
  default: () => <div data-testid="details">Details</div>,
}));

import * as router from 'react-router-dom';
vi.mock('react-router-dom', async () => {
  const actual =
    await vi.importActual<typeof import('react-router-dom')>(
      'react-router-dom'
    );
  return {
    ...actual,
    useParams: vi.fn(),
  };
});

afterEach(() => {
  vi.restoreAllMocks();
});

describe('MasterDetailWrapper', () => {
  it('renders only CharacterPage when no detailsId is present', () => {
    (router.useParams as Mock).mockReturnValue({});
    render(<MasterDetailWrapper />);

    expect(screen.getByTestId('character-page')).toBeInTheDocument();
    expect(screen.queryByTestId('details')).toBeNull();
  });

  it('renders Details panel when detailsId is present', () => {
    (router.useParams as Mock).mockReturnValue({ detailsId: '123' });

    render(<MasterDetailWrapper />);

    expect(screen.getByTestId('character-page')).toBeInTheDocument();
    expect(screen.getByTestId('details')).toBeInTheDocument();
  });
});
