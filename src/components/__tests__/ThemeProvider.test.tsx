import { render } from '@testing-library/react';
import { ThemeProvider } from '../../context/ThemeProvider';
import { afterEach, beforeEach, describe, expect, it } from 'vitest';

const setMatchMedia = (matches: boolean) => {
  const mq = (query: string): MediaQueryList => ({
    matches,
    media: query,
    onchange: null,
    addEventListener: () => void 0,
    removeEventListener: () => void 0,
    addListener: () => void 0,
    removeListener: () => void 0,
    dispatchEvent: () => false,
  });
  Object.defineProperty(window, 'matchMedia', {
    writable: true,
    value: mq,
  });
};

beforeEach(() => {
  document.documentElement.classList.remove('dark');
  localStorage.clear();
});

afterEach(() => {
  document.documentElement.classList.remove('dark');
  localStorage.clear();
});

describe('ThemeProvider', () => {
  it('reads saved theme and sets dark class', () => {
    localStorage.setItem('theme', 'dark');
    setMatchMedia(false);

    render(
      <ThemeProvider>
        <div>child</div>
      </ThemeProvider>
    );

    expect(document.documentElement.classList.contains('dark')).toBe(true);
  });
});
