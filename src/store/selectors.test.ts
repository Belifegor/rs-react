import { describe, it, expect } from 'vitest';
import { selectEntries, selectLastCreatedId } from './selectors';
import type { FormsState } from './useFormsStore';
import type { Entry } from '../types/types';

describe('selectors', () => {
  const mockEntries: Entry[] = [
    {
      id: '1',
      name: 'Alex',
      age: 25,
      email: 'alex@example.com',
      gender: 'male',
      acceptedTnC: true,
      country: 'Moldova',
      imageBase64: undefined,
      source: 'rhf',
      createdAt: Date.now(),
    },
    {
      id: '2',
      name: 'Anna',
      age: 30,
      email: 'anna@example.com',
      gender: 'female',
      acceptedTnC: true,
      country: 'Germany',
      imageBase64: undefined,
      source: 'uncontrolled',
      createdAt: Date.now(),
    },
  ];

  const mockState: FormsState = {
    entries: mockEntries,
    lastCreatedId: '2',
    addEntry: () => {},
    clearHighlight: () => {},
  };

  it('selectEntries должен возвращать список entries', () => {
    const result = selectEntries(mockState);
    expect(result).toEqual(mockEntries);
  });

  it('selectLastCreatedId должен возвращать lastCreatedId', () => {
    const result = selectLastCreatedId(mockState);
    expect(result).toBe('2');
  });
});
