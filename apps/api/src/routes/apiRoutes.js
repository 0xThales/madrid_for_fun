import { Hono } from "hono";

export function createApiRouter({ eventService, metaService, planService }) {
  const router = new Hono();

  router.get("/health", (context) => {
    return context.json({
      ok: true,
      service: "madrid-for-fun-api",
      docs: "/docs"
    });
  });

  router.get("/meta", (context) => {
    return context.json(metaService.getMeta());
  });

  router.get("/events", (context) => {
    return context.json(eventService.list(context.req.query()));
  });

  router.get("/events/:id", (context) => {
    const event = eventService.findById(context.req.param("id"));

    if (!event) {
      return context.json(
        {
          error: "Event not found",
          message: `No event exists with id ${context.req.param("id")}`
        },
        404
      );
    }

    return context.json({ data: event });
  });

  router.get("/plans", (context) => {
    return context.json(planService.generateFromQuery(context.req.query()));
  });

  router.post("/plans", async (context) => {
    const body = await context.req.json().catch(() => ({}));

    return context.json(planService.generateFromBody(body));
  });

  return router;
}
