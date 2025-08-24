import { describe, it, expect } from 'vitest';
import { COUNTRIES } from './countries';

describe('COUNTRIES', () => {
  it('не пустой', () => {
    expect(COUNTRIES.length).toBeGreaterThan(0);
  });

  it('содержит Молдову', () => {
    expect(COUNTRIES).toContain('Moldova');
  });

  it('содержит Румынию', () => {
    expect(COUNTRIES).toContain('Romania');
  });
});
