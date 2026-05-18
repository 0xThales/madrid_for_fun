import { createClient, type InArgs, type Row } from "@libsql/client";
import dotenv from "dotenv";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const projectRoot = path.join(__dirname, "..");
const defaultGlorpRoot = "/Users/dan/Desktop/me/glorp_explorer";
const defaultDbPath = path.join(defaultGlorpRoot, "local.db");
const defaultEnvPath = path.join(defaultGlorpRoot, ".env");
const outputPath = path.join(projectRoot, "data", "events.json");

const glorpEnvPath = process.env.GLORP_ENV_PATH || defaultEnvPath;
if (fs.existsSync(glorpEnvPath)) {
  dotenv.config({ path: glorpEnvPath, override: false, quiet: true });
}

const fromDate =
  process.env.GLORP_FROM_DATE ||
  process.env.MFF_TODAY ||
  new Date().toISOString().slice(0, 10);
const minQualityScore = Number(process.env.GLORP_MIN_QUALITY_SCORE ?? 3);
const localDbPath = process.env.GLORP_DB_PATH || defaultDbPath;
const databaseUrl =
  process.env.GLORP_DATABASE_URL ||
  process.env.TURSO_DATABASE_URL ||
  `file:${path.resolve(localDbPath)}`;
const authToken = process.env.GLORP_AUTH_TOKEN || process.env.TURSO_AUTH_TOKEN;

type GlorpEventRow = {
  id: number | string;
  title: string;
  description?: string | null;
  category: string;
  tags?: string | string[] | null;
  startsAt: string;
  endsAt?: string | null;
  venue_name: string;
  venue_address?: string | null;
  latitude?: number | null;
  longitude?: number | null;
  district?: string | null;
  price?: number | string | null;
  is_free?: boolean | number;
  price_details?: string | null;
  image_url?: string | null;
  source: string;
  source_url?: string | null;
};

function parseTags(tags: GlorpEventRow["tags"]): string[] {
  if (Array.isArray(tags)) {
    return tags.filter((tag): tag is string => typeof tag === "string");
  }

  if (!tags) {
    return [];
  }

  try {
    const parsed = JSON.parse(tags);
    return Array.isArray(parsed) ? parsed.filter((tag) => typeof tag === "string") : [];
  } catch {
    return [];
  }
}

function rowValue<T>(row: Row, key: string): T | undefined {
  return row[key] as T | undefined;
}

function toGlorpEventRow(row: Row): GlorpEventRow {
  return {
    id: rowValue<number | string>(row, "id") || "",
    title: rowValue<string>(row, "title") || "",
    description: rowValue<string | null>(row, "description") ?? null,
    category: rowValue<string>(row, "category") || "other",
    tags: rowValue<string | string[] | null>(row, "tags") ?? null,
    startsAt: rowValue<string>(row, "startsAt") || "",
    endsAt: rowValue<string | null>(row, "endsAt") ?? null,
    venue_name: rowValue<string>(row, "venue_name") || "",
    venue_address: rowValue<string | null>(row, "venue_address") ?? null,
    latitude: rowValue<number | null>(row, "latitude") ?? null,
    longitude: rowValue<number | null>(row, "longitude") ?? null,
    district: rowValue<string | null>(row, "district") ?? null,
    price: rowValue<number | string | null>(row, "price") ?? null,
    is_free: rowValue<boolean | number>(row, "is_free") ?? false,
    price_details: rowValue<string | null>(row, "price_details") ?? null,
    image_url: rowValue<string | null>(row, "image_url") ?? null,
    source: rowValue<string>(row, "source") || "unknown",
    source_url: rowValue<string | null>(row, "source_url") ?? null
  };
}

function toApiEvent(row: GlorpEventRow) {
  return {
    id: Number(row.id),
    title: row.title,
    description: row.description || null,
    category: row.category,
    tags: parseTags(row.tags),
    startsAt: row.startsAt,
    endsAt: row.endsAt || null,
    venue: {
      name: row.venue_name,
      address: row.venue_address || null,
      district: row.district || null,
      latitude: row.latitude ?? null,
      longitude: row.longitude ?? null
    },
    price: {
      amount: row.price ?? null,
      isFree: Boolean(row.is_free),
      details: row.price_details || null
    },
    imageUrl: row.image_url || null,
    source: {
      name: row.source,
      url: row.source_url || null
    }
  };
}

function visibleSourceLabel(url: string) {
  return url.startsWith("file:") ? url.replace(/^file:/, "") : "glorp-turso";
}

const client = createClient({
  url: databaseUrl,
  authToken
});

const tableInfo = await client.execute("pragma table_info(events)");
const columns = new Set(tableInfo.rows.map((row) => String(row.name)));
const conditions = ["start_datetime >= ?"];
const args: InArgs = [fromDate];

if (columns.has("is_primary")) {
  conditions.push("is_primary = 1");
}

if (columns.has("quality_score") && Number.isFinite(minQualityScore)) {
  conditions.push("quality_score >= ?");
  args.push(minQualityScore);
}

const result = await client.execute({
  sql: `
    select
      id,
      title,
      description,
      category,
      tags,
      start_datetime as startsAt,
      end_datetime as endsAt,
      venue_name,
      venue_address,
      latitude,
      longitude,
      district,
      price,
      is_free,
      price_details,
      image_url,
      source,
      source_url
    from events
    where ${conditions.join(" and ")}
    order by start_datetime asc, ${columns.has("quality_score") ? "quality_score desc," : ""} title asc
  `,
  args
});

const events = result.rows.map(toGlorpEventRow).map(toApiEvent);

fs.writeFileSync(
  outputPath,
  `${JSON.stringify(
    {
      generatedAt: new Date().toISOString(),
      fromDate,
      minQualityScore: Number.isFinite(minQualityScore) ? minQualityScore : null,
      source: visibleSourceLabel(databaseUrl),
      events
    },
    null,
    2
  )}\n`
);

console.log(
  `Exported ${events.length} events from ${visibleSourceLabel(databaseUrl)} to ${outputPath}`
);
