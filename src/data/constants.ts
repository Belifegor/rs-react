import { type YearRecord } from "../types/co2";

export const CO2_URL: string =
  "https://nyc3.digitaloceanspaces.com/owid-public/data/co2/owid-co2-data.json";

export const ALLOWED_EXTRA: (keyof YearRecord)[] = [
  "coal_co2",
  "oil_co2",
  "gas_co2",
  "flaring_co2",
  "methane",
  "nitrous_oxide",
  "land_use_change_co2",
  "total_ghg",
  "primary_energy_consumption",
];

export type Region =
  | "all"
  | "Africa"
  | "Asia"
  | "Europe"
  | "North America"
  | "South America"
  | "Oceania"
  | "Antarctica";

export const REGIONS: Region[] = [
  "all",
  "Africa",
  "Asia",
  "Europe",
  "North America",
  "South America",
  "Oceania",
  "Antarctica",
];
