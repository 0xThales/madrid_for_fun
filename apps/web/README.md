# Madrid For Fun Web

React + TypeScript + Vite app shell for the Madrid For Fun bootcamp project.

The backend is available in the same monorepo at `apps/api`, but the frontend is
intentionally not wired to it yet. Students should implement the API service
layer during the exercise.

## Run

From the monorepo root:

```bash
npm run dev
```

That starts both the API and web app. To run only the web app from the root:

```bash
npm run dev:web
```

Or from `apps/web` directly:

```bash
npm run dev
```

## API Readiness

Vite proxies `/api` and `/openapi.json` to `http://localhost:3001` by default.
Run the backend with:

```bash
npm run dev:api
```

Do not add frontend fetches before the classroom integration step.

## Suggested Exercise Order

1. Inspect `http://localhost:3001/docs`.
2. Create a small API module in `src/services/`.
3. Start with `GET /api/events?limit=6`.
4. Add loading and error UI to `EventsPage`.
5. Use `GET /api/events/:id` on the detail page.
6. Add onboarding preferences and call `POST /api/plans`.

This repo intentionally stops before step 2.
