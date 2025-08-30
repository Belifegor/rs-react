import type { YearRecord, OwidObject } from "../types/co2";

function isRecord(x: unknown): x is Record<string, unknown> {
  return typeof x === "object" && x !== null;
}

function isYearRecordLike(x: unknown): x is YearRecord {
  if (!isRecord(x)) return false;
  const y = (x as { year?: unknown }).year;
  return typeof y === "number";
}

function isOwidObject(x: unknown): x is OwidObject {
  if (!isRecord(x)) return false;
  const data = (x as { data?: unknown }).data;
  return Array.isArray(data) && data.every(isYearRecordLike);
}

export function getRows(entry: unknown): YearRecord[] {
  if (Array.isArray(entry) && entry.every(isYearRecordLike)) return entry;

  if (isOwidObject(entry)) return entry.data;

  return [];
}

export function getIso(entry: unknown): string | undefined {
  if (!isRecord(entry)) return undefined;
  const v = (entry as { iso_code?: unknown }).iso_code;
  return typeof v === "string" ? v : undefined;
}

export function getContinent(entry: unknown): string | undefined {
  if (!isRecord(entry)) return undefined;
  const v = (entry as { continent?: unknown }).continent;
  return typeof v === "string" ? v : undefined;
}
