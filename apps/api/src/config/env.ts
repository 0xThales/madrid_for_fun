export const DEFAULT_PORT = 3001;
export const DEFAULT_REFERENCE_DATE = "2026-05-13";

export function getPort() {
  return Number(process.env.PORT) || DEFAULT_PORT;
}

export function getReferenceDate() {
  return process.env.MFF_TODAY || DEFAULT_REFERENCE_DATE;
}
