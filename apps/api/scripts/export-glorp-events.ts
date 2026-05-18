import { execFileSync } from "node:child_process";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const projectRoot = path.join(__dirname, "..");
const defaultDbPath = "/Users/dan/Desktop/me/glorp_explorer/local.db";
const dbPath = process.env.GLORP_DB_PATH || defaultDbPath;
const outputPath = path.join(projectRoot, "data", "events.json");

const query = `
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
  where start_datetime >= '2026-05-13'
  order by start_datetime asc
`;

type GlorpEventRow = {
  id: number | string;
  title: string;
  description?: string | null;
  category: string;
  tags?: string | null;
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

function parseTags(tags: string | null | undefined): string[] {
  if (!tags) {
    return [];
  }

  try {
    const parsed = JSON.parse(tags);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
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

if (!fs.existsSync(dbPath)) {
  console.error(`Could not find Glorp database at ${dbPath}`);
  process.exit(1);
}

const json = execFileSync("sqlite3", ["-json", dbPath, query], {
  encoding: "utf8"
});

const events = (JSON.parse(json) as GlorpEventRow[]).map(toApiEvent);

fs.writeFileSync(
  outputPath,
  `${JSON.stringify(
    {
      generatedAt: new Date().toISOString(),
      source: dbPath,
      events
    },
    null,
    2
  )}\n`
);

console.log(`Exported ${events.length} events to ${outputPath}`);
