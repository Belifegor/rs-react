import { create } from 'zustand';
import { COUNTRIES } from '../utils/countries';

interface CountriesState {
  countries: string[];
}

export const useCountriesStore = create<CountriesState>(() => ({
  countries: COUNTRIES,
}));
