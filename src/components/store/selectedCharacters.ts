import { create } from 'zustand';
import type { Store } from './../../types/types';

export const useSelectionStore = create<Store>((set, get) => ({
  selected: [],
  toggle: (id) =>
    set((state) =>
      state.selected.includes(id)
        ? { selected: state.selected.filter((s) => s !== id) }
        : { selected: [...state.selected, id] }
    ),
  isSelected: (id) => get().selected.includes(id),
  unselectAll: () => set({ selected: [] }),
}));
