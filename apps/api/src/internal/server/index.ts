import { logger } from "hono/logger";
import { prettyJSON } from "hono/pretty-json";
import { secureHeaders } from "hono/secure-headers";
import { cors } from "hono/cors";
import { OpenAPIHono } from "@hono/zod-openapi";
import { createFiberplane } from "@fiberplane/hono";
import authHandler from "./handlers/account-handler";
import { withService } from "./middleware/with-service-layer";

export class Server {
  public readonly routes;

  constructor() {

    const app = new OpenAPIHono<{
      Bindings: {
        NODE_ENV: string,
        DATABASE_URL: string,
        CLERK_SECRET_KEY: string,
        CLERK_PUBLISHABLE_KEY: string,
        QUICK_BOOKS_CLIENT_ID: string,
        QUICK_BOOKS_CLIENT_SECRET: string,
        QUICK_BOOKS_REDIRECT_URI: string,
        QUICK_BOOKS_ENVIRONMENT: "sandbox" | "production",
        PLAID_CLIENT_ID: string,
        PLAID_SECRET: string,
        PLAID_WEBHOOK_URL: string,
        PLAID_ENVIRONMENT: "sandbox" | "production",
      }
    }>({
      defaultHook: (result, c) => {
        if (!result.success) {
          return c.json(
            {
              ok: false,
              errors: result.error.issues,
              source: 'custom_error_handler',
            },
            422
          )
        }
      },
    })

    app
      .use("*", logger())
      .use("*", prettyJSON())
      .use("*", secureHeaders())
      .use(cors({
        origin: ["http://localhost:3000", "https://app.fundlevel.co", "*"],
        allowMethods: ["GET", "POST", "PUT", "DELETE", "OPTIONS", "PATCH"],
        allowHeaders: ["Content-Type", "Authorization", "x-is-superjson"],
        credentials: true,
        exposeHeaders: ["*"],
      }))
      .use("*", withService())

    app.openAPIRegistry.registerComponent('securitySchemes', 'Bearer', {
      type: 'http',
      scheme: 'bearer',
      bearerFormat: 'JWT',
    })

    app.doc("/openapi.json", {
      openapi: "3.0.0",
      info: {
        title: "FundLevel API",
        version: "1.0.0",
        description: "FundLevel API"
      },
    })

    this.routes = app.route("/auth", authHandler)

    //! It is important to mount Fiberplane’s middleware after all of your route definitions.
    app.use(
      "/fp/*",
      createFiberplane({
        openapi: {
          url: "/openapi.json"
        }
      })
    );


  }
}