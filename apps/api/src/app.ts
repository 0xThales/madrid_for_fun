import { Hono } from "hono";
import { cors } from "hono/cors";
import { getReferenceDate } from "./config/env";
import { openApiSpec } from "./docs/openapi";
import { loadEvents } from "./repositories/eventsRepository";
import { createApiRouter } from "./routes/apiRoutes";
import { createEventService } from "./services/eventService";
import { createMetaService } from "./services/metaService";
import { createPlanService } from "./services/planService";
import type { Event } from "./types";

function renderDocsHtml() {
  return `<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>Madrid For Fun API Docs</title>
    <link rel="stylesheet" href="https://unpkg.com/swagger-ui-dist@5/swagger-ui.css" />
  </head>
  <body>
    <div id="swagger-ui"></div>
    <script src="https://unpkg.com/swagger-ui-dist@5/swagger-ui-bundle.js"></script>
    <script>
      window.ui = SwaggerUIBundle({
        url: "/openapi.json",
        dom_id: "#swagger-ui"
      });
    </script>
  </body>
</html>`;
}

type CreateAppOptions = {
  events?: Event[];
  referenceDate?: string;
};

export function createApp(options: CreateAppOptions = {}) {
  const app = new Hono();
  const events = options.events || loadEvents();
  const referenceDate = options.referenceDate || getReferenceDate();
  const eventService = createEventService(events);
  const metaService = createMetaService(events, referenceDate);
  const planService = createPlanService(events);

  app.use("*", cors({ origin: "*" }));

  app.get("/", (context) => {
    return context.redirect("/docs");
  });

  app.get("/docs", (context) => {
    return context.html(renderDocsHtml());
  });

  app.get("/openapi.json", (context) => {
    return context.json(openApiSpec);
  });

  app.route("/api", createApiRouter({ eventService, metaService, planService }));

  app.notFound((context) => {
    return context.json(
      {
        error: "Not found",
        message: `${context.req.method} ${new URL(context.req.url).pathname} is not an endpoint in this API. Try /docs.`
      },
      404
    );
  });

  return app;
}
