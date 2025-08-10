import {
  describe,
  it,
  expect,
  vi,
  beforeEach,
  type MockInstance,
} from 'vitest';
import { fetchCharacters, fetchPageData } from '../../api/api';

describe('rickAndMorty API', () => {
  let fetchSpy: MockInstance;

  beforeEach(() => {
    vi.restoreAllMocks();
    fetchSpy = vi.spyOn(globalThis, 'fetch');
  });

  describe('fetchCharacters', () => {
    it('returns characters if response is successful', async () => {
      const fakeData = {
        results: [
          {
            id: 1,
            name: 'Rick',
            species: 'Human',
            gender: 'Male',
            image: 'rick.png',
          },
        ],
        info: { next: null, prev: null },
      };

      fetchSpy.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(fakeData),
      } as Response);

      const data = await fetchCharacters('Rick');

      expect(fetchSpy).toHaveBeenCalledWith(
        'https://rickandmortyapi.com/api/character/?page=1&name=rick'
      );
      expect(data).toEqual(fakeData);
    });

    it('sends base request if empty string is passed', async () => {
      const fakeData = { results: [], info: { next: null, prev: null } };

      fetchSpy.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(fakeData),
      } as Response);

      const data = await fetchCharacters('   ');

      expect(fetchSpy).toHaveBeenCalledWith(
        'https://rickandmortyapi.com/api/character/?page=1'
      );
      expect(data).toEqual(fakeData);
    });

    it('throws an error if server returns error', async () => {
      fetchSpy.mockResolvedValueOnce({ ok: false } as Response);

      await expect(fetchCharacters('bad')).rejects.toThrow(
        'Character not found'
      );
    });
  });

  describe('fetchPageData', () => {
    it('loads the page if everything is ok', async () => {
      const fakeData = {
        results: [
          {
            id: 2,
            name: 'Morty',
            species: 'Human',
            gender: 'Male',
            image: 'morty.png',
          },
        ],
        info: { next: null, prev: null },
      };

      fetchSpy.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(fakeData),
      } as Response);

      const data = await fetchPageData('https://some-link.com');

      expect(fetchSpy).toHaveBeenCalledWith('https://some-link.com');
      expect(data).toEqual(fakeData);
    });

    it('throws an error if fetch fails', async () => {
      fetchSpy.mockResolvedValueOnce({ ok: false } as Response);

      await expect(fetchPageData('https://fail.com')).rejects.toThrow(
        'Failed to fetch page'
      );
    });
  });
});
