import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const projectRoot = path.join(__dirname, "..", "..");
const DATA_PATH = path.join(projectRoot, "data", "events.json");

function parseTags(tags) {
  if (Array.isArray(tags)) {
    return tags;
  }

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

function normalizeEvent(event) {
  const rawPrice = typeof event.price === "object" && event.price !== null
    ? event.price.amount
    : event.price;

  return {
    id: Number(event.id),
    title: event.title,
    description: event.description || null,
    category: event.category,
    tags: parseTags(event.tags),
    startsAt: event.startsAt || event.start_datetime,
    endsAt: event.endsAt || event.end_datetime || null,
    venue: {
      name: event.venue?.name || event.venue_name,
      address: event.venue?.address || event.venue_address || null,
      district: event.venue?.district || event.district || null,
      latitude: event.venue?.latitude ?? event.latitude ?? null,
      longitude: event.venue?.longitude ?? event.longitude ?? null
    },
    price: {
      amount: rawPrice ?? null,
      isFree: Boolean(event.price?.isFree ?? event.is_free),
      details: event.price?.details || event.price_details || null
    },
    imageUrl: event.imageUrl || event.image_url || null,
    source: {
      name: event.source?.name || event.source,
      url: event.source?.url || event.source_url || null
    }
  };
}

export function loadEvents() {
  const raw = fs.readFileSync(DATA_PATH, "utf8");
  const parsed = JSON.parse(raw);
  return parsed.events.map(normalizeEvent);
}
