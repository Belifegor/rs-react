import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import ErrorBoundary from '../ErrorBoundary';

const BugComponent = () => {
  throw new Error('Boom');
};

describe('ErrorBoundary', () => {
  it('renders fallback UI when child throws error', () => {
    render(
      <ErrorBoundary
        fallback={
          <div>
            Something went wrong.<button>Try again</button>
          </div>
        }
      >
        <BugComponent />
      </ErrorBoundary>
    );

    expect(screen.getByText('Something went wrong.')).toBeInTheDocument();
    expect(
      screen.getByRole('button', { name: /try again/i })
    ).toBeInTheDocument();
  });

  it('allows clicking try again button', async () => {
    const onReset = vi.fn();
    render(
      <ErrorBoundary
        fallback={
          <div>
            Something went wrong.<button onClick={onReset}>Try again</button>
          </div>
        }
      >
        <BugComponent />
      </ErrorBoundary>
    );

    const button = screen.getByRole('button', { name: /try again/i });
    await userEvent.click(button);

    expect(onReset).toHaveBeenCalled();
  });

  it('renders default fallback UI when no fallback prop is provided', () => {
    vi.spyOn(console, 'error').mockImplementation(() => {});

    render(
      <ErrorBoundary>
        <BugComponent />
      </ErrorBoundary>
    );

    expect(screen.getByText('Something went wrong.')).toBeInTheDocument();
    expect(
      screen.getByRole('button', { name: /try again/i })
    ).toBeInTheDocument();
  });
});
