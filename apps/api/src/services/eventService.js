import { getDateRange } from "../utils/date.js";
import { paginate } from "../utils/pagination.js";
import { includesText, parseBoolean, parseCsv } from "../utils/query.js";

export function filterEvents(events, query) {
  const categories = parseCsv(query.category || query.categories);
  const districts = parseCsv(query.district || query.districts);
  const free = parseBoolean(query.free);
  const search = query.q ? String(query.q).trim().toLowerCase() : "";
  const range = getDateRange(query.when);
  const from = query.from ? new Date(query.from) : range.from;
  const to = query.to ? new Date(query.to) : range.to;

  return events.filter((event) => {
    const startsAt = new Date(event.startsAt);

    if (categories.length > 0 && !categories.includes(event.category)) {
      return false;
    }

    if (districts.length > 0 && !districts.includes(event.venue.district)) {
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

export function createEventService(events) {
  return {
    list(query) {
      const filtered = filterEvents(events, query).sort((a, b) => {
        return new Date(a.startsAt) - new Date(b.startsAt);
      });

      return paginate(filtered, query);
    },

    findById(id) {
      return events.find((event) => event.id === Number(id)) || null;
    }
  };
}
