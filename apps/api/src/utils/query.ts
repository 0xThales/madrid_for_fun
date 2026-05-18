import type { QueryParamValue } from "../types";

export function firstQueryValue(value: QueryParamValue): string | undefined {
  if (Array.isArray(value)) {
    return value[0];
  }

  if (value === undefined) {
    return undefined;
  }

  return String(value);
}

export function includesText(value: string | null | undefined, query: string): boolean {
  return value?.toLowerCase().includes(query) ?? false;
}

export function parseCsv(value: QueryParamValue): string[] {
  if (!value) {
    return [];
  }

  return String(value)
    .split(",")
    .map((item) => item.trim())
    .filter(Boolean);
}

export function parseBoolean(value: QueryParamValue): boolean | null {
  const normalized = firstQueryValue(value);

  if (normalized === "true") {
    return true;
  }

  if (normalized === "false") {
    return false;
  }

  return null;
}
