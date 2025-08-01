import type { StateCreator } from 'zustand';

export interface SelectionSlice {
  selected: number[];
  toggle: (id: number) => void;
  isSelected: (id: number) => boolean;
  unselectAll: () => void;
}

export const createSelectionSlice: StateCreator<SelectionSlice> = (
  set,
  get
) => ({
  selected: [],
  toggle: (id) =>
    set((state) =>
      state.selected.includes(id)
        ? { selected: state.selected.filter((s) => s !== id) }
        : { selected: [...state.selected, id] }
    ),
  isSelected: (id) => get().selected.includes(id),
  unselectAll: () => set({ selected: [] }),
});
