import type { Event, MetaService } from "../types";

export function createMetaService(events: Event[], referenceDate: string): MetaService {
  return {
    getMeta() {
      const categories = [...new Set(events.map((event) => event.category))].sort();
      const districts = [
        ...new Set(
          events
            .map((event) => event.venue.district)
            .filter((district): district is string => Boolean(district))
        )
      ].sort();

      return {
        name: "Madrid For Fun API",
        referenceDate,
        totalEvents: events.length,
        categories,
        districts,
        moods: ["cultural", "date", "friends", "free", "night", "weird"]
      };
    }
  };
}
