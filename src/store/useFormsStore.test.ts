import { describe, it, expect, beforeEach } from 'vitest';
import { useFormsStore } from './useFormsStore';
import type { Entry } from '../types/types';

describe('useFormsStore', () => {
  beforeEach(() => {
    useFormsStore.setState({ entries: [], lastCreatedId: null });
  });

  it('должен иметь корректное начальное состояние', () => {
    const { entries, lastCreatedId } = useFormsStore.getState();
    expect(entries).toEqual([]);
    expect(lastCreatedId).toBeNull();
  });

  it('addEntry: добавляет запись и выставляет lastCreatedId', () => {
    const entry: Entry = {
      id: 'id-1',
      name: 'Alice',
      age: 22,
      email: 'alice@example.com',
      gender: 'female',
      acceptedTnC: true,
      country: 'Moldova',
      imageBase64: undefined,
      source: 'rhf',
      createdAt: 1710000000000,
    };

    useFormsStore.getState().addEntry(entry);

    const { entries, lastCreatedId } = useFormsStore.getState();
    expect(entries.length).toBe(1);
    expect(entries[0]).toEqual(entry);
    expect(lastCreatedId).toBe('id-1');
  });

  it('addEntry: кладёт новую запись в начало массива и не мутирует прошлую ссылку', () => {
    const first: Entry = {
      id: 'id-1',
      name: 'A',
      age: 20,
      email: 'a@a.com',
      gender: 'male',
      acceptedTnC: true,
      country: 'Moldova',
      imageBase64: undefined,
      source: 'uncontrolled',
      createdAt: 1700000000000,
    };
    const second: Entry = {
      id: 'id-2',
      name: 'B',
      age: 21,
      email: 'b@b.com',
      gender: 'female',
      acceptedTnC: true,
      country: 'Romania',
      imageBase64: undefined,
      source: 'rhf',
      createdAt: 1700000001000,
    };

    useFormsStore.getState().addEntry(first);
    const prevEntriesRef = useFormsStore.getState().entries; // ссылка до второго add
    useFormsStore.getState().addEntry(second);

    const { entries, lastCreatedId } = useFormsStore.getState();

    expect(entries[0]).toEqual(second);
    expect(entries[1]).toEqual(first);

    expect(entries).not.toBe(prevEntriesRef);

    expect(lastCreatedId).toBe('id-2');
  });

  it('clearHighlight: сбрасывает lastCreatedId в null', () => {
    const e: Entry = {
      id: 'idx',
      name: 'X',
      age: 30,
      email: 'x@x.com',
      gender: 'other',
      acceptedTnC: true,
      country: 'Poland',
      imageBase64: undefined,
      source: 'rhf',
      createdAt: 1700000002000,
    };

    useFormsStore.getState().addEntry(e);
    expect(useFormsStore.getState().lastCreatedId).toBe('idx');

    useFormsStore.getState().clearHighlight();
    expect(useFormsStore.getState().lastCreatedId).toBeNull();
  });
});
