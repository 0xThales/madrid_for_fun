import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import type { Event } from "../types";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const projectRoot = path.join(__dirname, "..", "..");
const DATA_PATH = path.join(projectRoot, "data", "events.json");

type RawEvent = {
  id: number | string;
  title: string;
  description?: string | null;
  category: string;
  tags?: string[] | string | null;
  startsAt?: string;
  start_datetime?: string;
  endsAt?: string | null;
  end_datetime?: string | null;
  venue?: {
    name?: string | null;
    address?: string | null;
    district?: string | null;
    latitude?: number | null;
    longitude?: number | null;
  };
  venue_name?: string | null;
  venue_address?: string | null;
  district?: string | null;
  latitude?: number | null;
  longitude?: number | null;
  price?: { amount?: number | string | null; isFree?: boolean; details?: string | null } | number | string | null;
  is_free?: boolean | number;
  price_details?: string | null;
  imageUrl?: string | null;
  image_url?: string | null;
  source?: { name?: string | null; url?: string | null } | string | null;
  source_url?: string | null;
};

function parseTags(tags: RawEvent["tags"]): string[] {
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

function normalizeEvent(event: RawEvent): Event {
  const price = event.price;
  const priceObject = typeof price === "object" && price !== null ? price : null;
  const rawPrice = priceObject ? priceObject.amount : price;

  return {
    id: Number(event.id),
    title: event.title,
    description: event.description || null,
    category: event.category,
    tags: parseTags(event.tags),
    startsAt: event.startsAt || event.start_datetime || "",
    endsAt: event.endsAt || event.end_datetime || null,
    venue: {
      name: event.venue?.name || event.venue_name || null,
      address: event.venue?.address || event.venue_address || null,
      district: event.venue?.district || event.district || null,
      latitude: event.venue?.latitude ?? event.latitude ?? null,
      longitude: event.venue?.longitude ?? event.longitude ?? null
    },
    price: {
      amount: typeof rawPrice === "object" ? null : rawPrice ?? null,
      isFree: Boolean(priceObject?.isFree ?? event.is_free),
      details: priceObject?.details || event.price_details || null
    },
    imageUrl: event.imageUrl || event.image_url || null,
    source: {
      name: typeof event.source === "object" ? event.source?.name || null : event.source || null,
      url: typeof event.source === "object" ? event.source?.url || event.source_url || null : event.source_url || null
    }
  };
}

export function loadEvents(): Event[] {
  const raw = fs.readFileSync(DATA_PATH, "utf8");
  const parsed = JSON.parse(raw) as { events: RawEvent[] };
  return parsed.events.map(normalizeEvent);
}
