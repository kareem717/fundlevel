import { serve } from "@hono/node-server";
import { server } from "./core";
import { env } from "./env";

serve({
  fetch: server.app.fetch,
  port: env.PORT,
});
