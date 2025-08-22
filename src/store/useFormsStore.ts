import { create } from 'zustand';
import type { Entry } from '../types/types';

export interface FormsState {
  entries: Entry[];
  lastCreatedId?: string;
  addEntry: (e: Entry) => void;
  clearHighlight: () => void;
}

export const useFormsStore = create<FormsState>((set) => ({
  entries: [],
  addEntry: (e) =>
    set((s) => ({ entries: [e, ...s.entries], lastCreatedId: e.id })),
  clearHighlight: () => set({ lastCreatedId: undefined }),
}));
