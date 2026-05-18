import { getReferenceDate } from "../config/env";
import type { DateRange, QueryParamValue } from "../types";
import { firstQueryValue } from "./query";

export function parseDateOnly(value: string | undefined): Date | null {
  if (!value) {
    return null;
  }

  const parsed = new Date(`${value}T00:00:00.000Z`);
  return Number.isNaN(parsed.getTime()) ? null : parsed;
}

export function getDateRange(
  when: QueryParamValue,
  referenceDate = getReferenceDate()
): DateRange {
  const start = parseDateOnly(referenceDate);
  const normalizedWhen = firstQueryValue(when);

  if (!start) {
    return {};
  }

  const addDays = (date: Date, days: number) => {
    const next = new Date(date);
    next.setUTCDate(next.getUTCDate() + days);
    return next;
  };

  if (normalizedWhen === "today") {
    return { from: start, to: addDays(start, 1) };
  }

  if (normalizedWhen === "tomorrow") {
    return { from: addDays(start, 1), to: addDays(start, 2) };
  }

  if (normalizedWhen === "weekend") {
    const day = start.getUTCDay();
    const daysUntilSaturday = (6 - day + 7) % 7;
    const saturday = addDays(start, daysUntilSaturday);
    return { from: saturday, to: addDays(saturday, 2) };
  }

  if (normalizedWhen === "week") {
    return { from: start, to: addDays(start, 7) };
  }

  return {};
}

export function toIsoDate(date: Date | undefined): string | undefined {
  return date ? date.toISOString().slice(0, 10) : undefined;
}
