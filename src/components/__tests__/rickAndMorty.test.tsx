import { describe, it, expect, vi, beforeEach } from 'vitest';
import { fetchCharacters, fetchPageData } from '../../api/api';

describe('rickAndMorty API', () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  describe('fetchCharacters', () => {
    it('return characters, if response successful ', async () => {
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

      vi.spyOn(globalThis, 'fetch').mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(fakeData),
      } as Response);

      const data = await fetchCharacters('Rick');

      expect(fetch).toHaveBeenCalledWith(
        'https://rickandmortyapi.com/api/character/?name=rick&page=1'
      );
      expect(data).toEqual(fakeData);
    });

    it('if you pass an empty string the basic request should go', async () => {
      const fakeData = {
        results: [],
        info: { next: null, prev: null },
      };

      vi.spyOn(globalThis, 'fetch').mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(fakeData),
      } as Response);

      const data = await fetchCharacters('   ');
      expect(fetch).toHaveBeenCalledWith(
        'https://rickandmortyapi.com/api/character'
      );
      expect(data).toEqual(fakeData);
    });

    it('if the server returns an error there should be an error', async () => {
      vi.spyOn(globalThis, 'fetch').mockResolvedValueOnce({
        ok: false,
      } as Response);

      await expect(fetchCharacters('bad')).rejects.toThrow(
        'Character not found'
      );
    });
  });

  describe('fetchPageData', () => {
    it('should load the next page if everything is ok', async () => {
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

      vi.spyOn(globalThis, 'fetch').mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(fakeData),
      } as Response);

      const data = await fetchPageData('https://some-link.com');

      expect(fetch).toHaveBeenCalledWith('https://some-link.com');
      expect(data).toEqual(fakeData);
    });

    it('throw an error if not works', async () => {
      vi.spyOn(globalThis, 'fetch').mockResolvedValueOnce({
        ok: false,
      } as Response);

      await expect(fetchPageData('https://fail.com')).rejects.toThrow(
        'Failed to fetch page'
      );
    });
  });
});
