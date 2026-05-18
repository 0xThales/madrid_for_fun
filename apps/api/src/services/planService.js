import { filterEvents } from "./eventService.js";

const MOOD_RULES = {
  cultural: {
    title: "Cultural afternoon",
    categories: ["exhibition", "theater", "cinema", "dance"],
    description: "A plan for seeing something with a bit of substance."
  },
  date: {
    title: "Date night",
    categories: ["music", "theater", "exhibition", "dance"],
    description: "A polished plan that gives you something to talk about."
  },
  friends: {
    title: "Friends plan",
    categories: ["music", "workshop", "market", "gastro", "dance"],
    description: "A social plan that is easy to say yes to."
  },
  free: {
    title: "Free Madrid",
    categories: [],
    free: true,
    description: "A no-budget plan using free events."
  },
  night: {
    title: "Night energy",
    categories: ["music", "dance", "theater"],
    description: "A later plan with more movement."
  },
  weird: {
    title: "Something different",
    categories: ["workshop", "dance", "other"],
    description: "For when you want Madrid to surprise you a little."
  }
};

function eventScore(event, preferences) {
  let score = 0;
  const startsAt = new Date(event.startsAt);
  const hour = startsAt.getUTCHours();

  if (event.imageUrl) score += 3;
  if (event.price.isFree) score += 2;
  if (event.venue.district === "Centro") score += 1;
  if (preferences.mood === "night" && hour >= 18) score += 4;
  if (preferences.mood === "date" && event.imageUrl) score += 2;
  if (preferences.categories?.includes(event.category)) score += 4;

  return score;
}

function buildPlan(id, mood, events, preferences) {
  const rule = MOOD_RULES[mood] || MOOD_RULES.cultural;
  const selected = events
    .filter((event) => {
      if (rule.free && !event.price.isFree) return false;
      if (rule.categories.length === 0) return true;
      return rule.categories.includes(event.category);
    })
    .sort((a, b) => eventScore(b, preferences) - eventScore(a, preferences))
    .slice(0, 3);

  if (selected.length === 0) {
    return null;
  }

  const districts = [...new Set(selected.map((event) => event.venue.district).filter(Boolean))];
  const totalKnownPrice = selected.reduce((total, event) => {
    return total + (Number(event.price.amount) || 0);
  }, 0);

  return {
    id,
    title: rule.title,
    mood,
    description: rule.description,
    districts,
    estimatedPrice: selected.every((event) => event.price.isFree)
      ? "Gratis"
      : totalKnownPrice > 0
        ? `Desde ${totalKnownPrice} EUR`
        : "Precio variable",
    events: selected
  };
}

function normalizeQueryPreferences(query) {
  return {
    mood: query.mood,
    when: query.when,
    district: query.district,
    budget: query.budget,
    categories: query.categories
      ? String(query.categories).split(",").map((item) => item.trim())
      : undefined
  };
}

export function generatePlans(allEvents, preferences) {
  const baseEvents = filterEvents(allEvents, {
    when: preferences.when || "week",
    district: preferences.district,
    category: preferences.categories?.join(","),
    free: preferences.budget === "free" ? "true" : undefined,
    limit: 50
  });

  const moods = preferences.mood
    ? [preferences.mood, "free", "cultural"]
    : ["cultural", "date", "friends", "free", "night", "weird"];

  const uniqueMoods = [...new Set(moods)];

  return uniqueMoods
    .map((mood, index) => buildPlan(`plan_${index + 1}_${mood}`, mood, baseEvents, preferences))
    .filter(Boolean)
    .slice(0, 3);
}

export function createPlanService(events) {
  return {
    generateFromQuery(query) {
      const preferences = normalizeQueryPreferences(query);

      return {
        data: generatePlans(events, preferences),
        meta: { preferences }
      };
    },

    generateFromBody(body = {}) {
      const preferences = body || {};

      return {
        data: generatePlans(events, preferences),
        meta: { preferences }
      };
    }
  };
}
