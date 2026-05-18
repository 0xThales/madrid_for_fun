export function createMetaService(events, referenceDate) {
  return {
    getMeta() {
      const categories = [...new Set(events.map((event) => event.category))].sort();
      const districts = [
        ...new Set(events.map((event) => event.venue.district).filter(Boolean))
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
