import { renderHook } from '@testing-library/react';
import { ThemeContext } from '../../context/ThemeContext';
import { useTheme } from '../../hooks/useTheme';
import { vi, describe, it, expect, beforeEach } from 'vitest';

type Theme = 'light' | 'dark';

const setThemeMock = vi.fn();

beforeEach(() => setThemeMock.mockClear());

describe('useTheme', () => {
  it('возвращает значение из ThemeContext и вызывает setTheme', () => {
    const wrapper = ({ children }: { children: React.ReactNode }) => (
      <ThemeContext.Provider
        value={{ theme: 'dark' as Theme, setTheme: setThemeMock }}
      >
        {children}
      </ThemeContext.Provider>
    );

    const { result } = renderHook(() => useTheme(), { wrapper });

    expect(result.current.theme).toBe('dark');
    result.current.setTheme('light');
    expect(setThemeMock).toHaveBeenCalledWith('light');
  });
});
