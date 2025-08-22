import type { FormsState } from './useFormsStore';

export const selectEntries = (s: FormsState) => s.entries;
export const selectLastCreatedId = (s: FormsState) => s.lastCreatedId;
