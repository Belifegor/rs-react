import { describe, it, expect, beforeEach } from 'vitest';
import { useCountriesStore } from './useCountriesStore';
import { COUNTRIES } from '../utils/countries';

describe('useCountriesStore', () => {
  beforeEach(() => {
    useCountriesStore.setState({ countries: COUNTRIES });
  });

  it('должен содержать массив стран из Countries', () => {
    const { countries } = useCountriesStore.getState();
    expect(countries).toEqual(COUNTRIES);
  });

  it('массив стран не должен быть пустым', () => {
    const { countries } = useCountriesStore.getState();
    expect(countries.length).toBeGreaterThan(0);
  });

  it('каждый элемент массива должен быть строкой', () => {
    const { countries } = useCountriesStore.getState();
    countries.forEach((c) => {
      expect(typeof c).toBe('string');
    });
  });
});
