# Madrid For Fun API

A small TypeScript/Hono backend for the bootcamp React project.

The idea: students build a frontend that helps people find fun Madrid plans. This API gives them real-ish event data adapted from Glorp Explorer, without making the class depend on Glorp internals, Turso, auth, or scrapers.

## Run It

From the monorepo root:

```bash
npm install
npm run dev
```

That starts both the API and web app. To run only the API from the root:

```bash
npm run dev:api
```

Or from `apps/api` directly:

```bash
npm run dev
```

Open:

- API docs: http://localhost:3001/docs
- OpenAPI JSON: http://localhost:3001/openapi.json
- Health check: http://localhost:3001/api/health

## Backend Structure

```txt
src/
  app.ts                 # Hono app factory used by server and tests
  server.ts              # Local Hono Node runtime entrypoint
  config/                # Environment defaults and parsing
  docs/                  # OpenAPI spec
  repositories/          # Data loading and normalization
  routes/                # Hono route wiring
  services/              # Business logic for events, metadata, and plans
  types.ts               # Shared backend domain types
  utils/                 # Date, query, and pagination helpers
test/                    # TypeScript Node test suite
data/events.json         # Frozen teaching dataset
scripts/                 # Dataset export utilities
```

The backend is intentionally small: Hono owns HTTP routing, while the services
own the event filtering and plan-generation logic.

## Check It

```bash
npm test
```

## Student-Friendly Endpoints

### `GET /api/meta`

Use this to build onboarding options and filters.

```ts
const res = await fetch("http://localhost:3001/api/meta");
const meta = await res.json();
```

### `GET /api/events`

List events. Supports filters:

- `when`: `today`, `tomorrow`, `weekend`, `week`
- `category`: one category, for example `music`
- `categories`: comma-separated list, for example `music,theater`
- `district`: one Madrid district, for example `Centro`
- `free`: `true` or `false`
- `q`: search text
- `limit`: max `50`
- `page`: page number

Examples:

```txt
GET /api/events?when=weekend
GET /api/events?category=music&district=Centro
GET /api/events?free=true&limit=6
GET /api/events?q=teatro
```

React example:

```ts
const res = await fetch("http://localhost:3001/api/events?when=weekend&limit=6");
const json = await res.json();
setEvents(json.data);
```

### `GET /api/events/:id`

Get a single event for a detail page.

```txt
GET /api/events/135
```

### `GET /api/plans`

Generate simple plan suggestions from query params.

Filters:

- `mood`: `cultural`, `date`, `friends`, `free`, `night`, `weird`
- `when`: `today`, `tomorrow`, `weekend`, `week`
- `district`: for example `Centro`
- `categories`: comma-separated list
- `budget`: `free` or `any`

Examples:

```txt
GET /api/plans?mood=date&when=weekend&district=Centro
GET /api/plans?mood=free&budget=free
```

### `POST /api/plans`

Useful after onboarding. Send preferences in the request body.

```ts
const res = await fetch("http://localhost:3001/api/plans", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({
    mood: "date",
    when: "weekend",
    district: "Centro",
    categories: ["music", "theater"],
    budget: "any"
  })
});

const json = await res.json();
setPlans(json.data);
```

## Event Shape

```ts
{
  id: 66995,
  title: "El diablo viste de Prada 2",
  description: "Text or null",
  category: "cinema",
  tags: ["comedia"],
  startsAt: "2026-05-18T13:45:00.000Z",
  endsAt: null,
  venue: {
    name: "Renoir Retiro",
    address: null,
    district: null,
    latitude: null,
    longitude: null
  },
  price: {
    amount: null,
    isFree: false,
    details: "Sesiones: 15:45, 18:00, 20:15, 22:30"
  },
  imageUrl: "https://...",
  source: {
    name: "ecartelera",
    url: "https://..."
  }
}
```

## Refresh Data From Glorp

The committed dataset lives in `data/events.json`.

The API uses `2026-05-18` as its default teaching reference date, so filters like `when=today` and `when=weekend` keep working with this frozen dataset. You can override it while running the server:

```bash
MFF_TODAY=2026-05-20 npm run dev
```

To regenerate it from Glorp:

```bash
npm run export:glorp
```

By default, the script loads Glorp's local `.env`, uses `TURSO_DATABASE_URL` / `TURSO_AUTH_TOKEN` when present, and falls back to:

```txt
/Users/dan/Desktop/me/glorp_explorer/local.db
```

The default export keeps future primary events with `quality_score >= 3`. Useful overrides:

```bash
GLORP_FROM_DATE=2026-05-18 npm run export:glorp
GLORP_MIN_QUALITY_SCORE=0 npm run export:glorp
GLORP_DB_PATH=/path/to/local.db npm run export:glorp
```

## Teaching Notes

Suggested frontend screens:

- onboarding: vibe, categories, district, budget, date
- results: generated plan cards
- explore: event grid with filters
- event detail
- saved plan

The API intentionally returns plain JSON and keeps errors simple. The goal is to make frontend integration feel real without drowning students in backend complexity.
