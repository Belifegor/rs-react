export type YearRecord = {
  year: number;
  population?: number;
  co2?: number;
  co2_per_capita?: number;
  coal_co2?: number;
  oil_co2?: number;
  gas_co2?: number;
  flaring_co2?: number;
  methane?: number;
  nitrous_oxide?: number;
  land_use_change_co2?: number;
  total_ghg?: number;
  primary_energy_consumption?: number;
};

export type OwidObject = {
  iso_code?: string;
  continent?: string;
  data: YearRecord[];
};

export type OwidEntry = YearRecord[] | OwidObject;

export type Co2Dataset = Record<string, OwidEntry>;
