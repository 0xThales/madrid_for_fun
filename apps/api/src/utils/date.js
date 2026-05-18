import { getReferenceDate } from "../config/env.js";

export function parseDateOnly(value) {
  if (!value) {
    return null;
  }

  const parsed = new Date(`${value}T00:00:00.000Z`);
  return Number.isNaN(parsed.getTime()) ? null : parsed;
}

export function getDateRange(when, referenceDate = getReferenceDate()) {
  const start = parseDateOnly(referenceDate);

  if (!start) {
    return {};
  }

  const addDays = (date, days) => {
    const next = new Date(date);
    next.setUTCDate(next.getUTCDate() + days);
    return next;
  };

  if (when === "today") {
    return { from: start, to: addDays(start, 1) };
  }

  if (when === "tomorrow") {
    return { from: addDays(start, 1), to: addDays(start, 2) };
  }

  if (when === "weekend") {
    const day = start.getUTCDay();
    const daysUntilSaturday = (6 - day + 7) % 7;
    const saturday = addDays(start, daysUntilSaturday);
    return { from: saturday, to: addDays(saturday, 2) };
  }

  if (when === "week") {
    return { from: start, to: addDays(start, 7) };
  }

  return {};
}

export function toIsoDate(date) {
  return date ? date.toISOString().slice(0, 10) : undefined;
}
