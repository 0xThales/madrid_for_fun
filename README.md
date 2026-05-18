# Madrid For Fun Fullstack

Teaching monorepo for a React bootcamp project.

The backend is a ready-made TypeScript/Hono API with Madrid events and plan-generation
endpoints. The frontend is intentionally not wired to it yet, so students can
practice implementing the API integration themselves.

## Structure

```txt
apps/
  api/    # TypeScript/Hono API, Swagger/OpenAPI docs, JSON dataset, tests
  web/    # React + Vite app shell
```

## Commands

```bash
npm install
npm run dev
npm test
npm run check
```

API docs:

- `http://localhost:3001/docs`
- `http://localhost:3001/openapi.json`
- `http://localhost:3001/api/health`

Frontend dev server:

- `http://localhost:5173`

During class, use `npm run dev` from the repo root. It starts both:

- API: `http://localhost:3001`
- Web: `http://localhost:5173`

You can still run them separately with `npm run dev:api` and `npm run dev:web`
if you want two terminals.

## Frontend/API Boundary

The web app has a Vite dev proxy for `/api` and `/openapi.json`, pointing to
`http://localhost:3001` by default. That means a future frontend service can use
relative URLs like `/api/events`.

No frontend API client, fetch wrapper, React hook, or page-level fetch has been
implemented yet. `apps/web/src/services/` is intentionally still a placeholder.

## Student Integration Exercise

When you are ready to teach the FE-BE connection, the intended path is:

1. Run the project with `npm run dev`.
2. Open the web app at `http://localhost:5173`.
3. Open `http://localhost:3001/docs` to inspect the API.
4. Create a frontend service file inside `apps/web/src/services/`.
5. Use relative URLs from the web app, for example `/api/events?limit=6`.
6. Replace the placeholder pages with loading, error, empty, and success states.

The infrastructure is ready, but the exercise code is deliberately not written.
