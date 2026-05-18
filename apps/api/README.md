# Madrid For Fun API

A small backend for the bootcamp React project.

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

- API docs: http://localhost:4000/docs
- OpenAPI JSON: http://localhost:4000/openapi.json
- Health check: http://localhost:4000/api/health

## Backend Structure

```txt
src/
  app.js                 # Hono app factory used by server and tests
  server.js              # Local Hono Node runtime entrypoint
  config/                # Environment defaults and parsing
  docs/                  # OpenAPI spec
  repositories/          # Data loading and normalization
  routes/                # Hono route wiring
  services/              # Business logic for events, metadata, and plans
  utils/                 # Date, query, and pagination helpers
test/                    # Node test suite
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

```js
const res = await fetch("http://localhost:4000/api/meta");
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

```js
const res = await fetch("http://localhost:4000/api/events?when=weekend&limit=6");
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

```js
const res = await fetch("http://localhost:4000/api/plans", {
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

```js
{
  id: 135,
  title: "Cinefórum Esqueria...",
  description: "Text or null",
  category: "music",
  tags: ["gratis"],
  startsAt: "2026-05-13T16:00:00.000Z",
  endsAt: "2026-05-13T21:59:00.000Z",
  venue: {
    name: "Biblioteca Pública Municipal Iván de Vargas",
    address: "CALLE SAN JUSTO 5",
    district: "Centro",
    latitude: 40.4141,
    longitude: -3.7098
  },
  price: {
    amount: null,
    isFree: true,
    details: null
  },
  imageUrl: null,
  source: {
    name: "datos_madrid",
    url: "https://..."
  }
}
```

## Refresh Data From Glorp

The committed dataset lives in `data/events.json`.

The API uses `2026-05-13` as its default teaching reference date, so filters like `when=today` and `when=weekend` keep working with this frozen dataset. You can override it while running the server:

```bash
MFF_TODAY=2026-05-16 npm run dev
```

To regenerate it from the local Glorp SQLite database:

```bash
npm run export:glorp
```

By default the script reads:

```txt
/Users/dan/Desktop/me/glorp_explorer/local.db
```

You can override that:

```bash
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
