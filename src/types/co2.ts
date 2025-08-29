export type YearRecord = {
  year: number;
  population?: number;
  co2?: number;
  co2_per_capita?: number;
};

export type Co2Dataset = Record<string, YearRecord[]>;
