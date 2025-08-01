import { create } from 'zustand';
import { createSelectionSlice, type SelectionSlice } from './selectionSlice';

export const useStore = create<SelectionSlice>()((...a) => ({
  ...createSelectionSlice(...a),
}));
