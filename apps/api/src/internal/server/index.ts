import "dotenv/config";
import { authMiddleware } from "./middleware";
import { logger } from "hono/logger";
import { prettyJSON } from "hono/pretty-json";
import { secureHeaders } from "hono/secure-headers";
import { cors } from "hono/cors";
import { OpenAPIHono } from "@hono/zod-openapi";
import { swaggerUI } from "@hono/swagger-ui";
import accountHandler from "./handlers/account";
import type { Service } from "../service";
import companyHandler from "./handlers/company";
import webhookHandler from "./handlers/webhook";

export class Server {
  public readonly routes;
  public readonly app;

  constructor(service: Service) {
    const app = new OpenAPIHono({
      defaultHook: (result, c) => {
        if (!result.success) {
          return c.json(
            {
              ok: false,
              errors: result.error.issues,
              source: "custom_error_handler",
            },
            422,
          );
        }
      },
    });

    app
      .use("*", logger())
      .use("*", prettyJSON())
      .use("*", secureHeaders())
      .use(
        "*",
        cors({
          origin: ["http://localhost:3000"],
          allowMethods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
          exposeHeaders: ["Content-Type", "Authorization"],
          maxAge: 600,
          credentials: true,
        }),
      )
      .use("*", authMiddleware(service.account));

    app.openAPIRegistry.registerComponent("securitySchemes", "Bearer", {
      type: "http",
      scheme: "bearer",
      bearerFormat: "JWT",
    });

    app.doc("/doc", (c) => ({
      openapi: "3.0.0",
      info: {
        version: "1.0.0",
        title: "My API",
      },
      servers: [
        {
          url: new URL(c.req.url).origin,
          description: "Current environment",
        },
      ],
    }));
    app.get("/ui", swaggerUI({ url: "/doc" }));
    this.app = app;

    this.routes = app
      .route("/accounts", accountHandler(service.account))
      .route(
        "/companies",
        companyHandler(service.company),
      )
      .route("/webhooks", webhookHandler(service.company));
  }
}
