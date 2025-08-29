export type YearRecord = {
  year: number;
  population?: number;
  co2?: number;
  co2PerCapita?: number;
};

export type Co2Dataset = Record<string, YearRecord[]>;
