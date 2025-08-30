export type YearRecord = {
  year: number;
  population?: number;
  co2?: number;
  co2_per_capita?: number;
};

export type OwidObject = {
  iso_code?: string;
  continent?: string;
  data: YearRecord[];
};

export type OwidEntry = YearRecord[] | OwidObject;

export type Co2Dataset = Record<string, OwidEntry>;
