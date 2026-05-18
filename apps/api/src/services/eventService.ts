import type { Event, EventService, QueryParams } from "../types";
import { getDateRange } from "../utils/date";
import { paginate } from "../utils/pagination";
import { firstQueryValue, includesText, parseBoolean, parseCsv } from "../utils/query";

export function filterEvents(events: Event[], query: QueryParams): Event[] {
  const categories = parseCsv(query.category || query.categories);
  const districts = parseCsv(query.district || query.districts);
  const free = parseBoolean(query.free);
  const search = firstQueryValue(query.q)?.trim().toLowerCase() || "";
  const range = getDateRange(query.when);
  const fromValue = firstQueryValue(query.from);
  const toValue = firstQueryValue(query.to);
  const from = fromValue ? new Date(fromValue) : range.from;
  const to = toValue ? new Date(toValue) : range.to;

  return events.filter((event) => {
    const startsAt = new Date(event.startsAt);

    if (categories.length > 0 && !categories.includes(event.category)) {
      return false;
    }

    if (districts.length > 0 && (!event.venue.district || !districts.includes(event.venue.district))) {
      return false;
    }

    if (free !== null && event.price.isFree !== free) {
      return false;
    }

    if (from && startsAt < from) {
      return false;
    }

    if (to && startsAt >= to) {
      return false;
    }

    if (search) {
      return (
        includesText(event.title, search) ||
        includesText(event.description, search) ||
        includesText(event.venue.name, search) ||
        includesText(event.venue.district, search) ||
        event.tags.some((tag) => includesText(tag, search))
      );
    }

    return true;
  });
}

export function createEventService(events: Event[]): EventService {
  return {
    list(query) {
      const filtered = filterEvents(events, query).sort((a, b) => {
        return new Date(a.startsAt).getTime() - new Date(b.startsAt).getTime();
      });

      return paginate(filtered, query);
    },

    findById(id) {
      return events.find((event) => event.id === Number(id)) || null;
    }
  };
}
