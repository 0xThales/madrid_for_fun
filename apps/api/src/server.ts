import { serve } from "@hono/node-server";
import { createApp } from "./app";
import { getPort } from "./config/env";

const port = getPort();
const app = createApp();

serve({ fetch: app.fetch, port }, () => {
  console.log(`Madrid For Fun API running on http://localhost:${port}`);
  console.log(`Swagger docs: http://localhost:${port}/docs`);
});
