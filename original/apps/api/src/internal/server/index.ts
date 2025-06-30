import { logger } from "hono/logger";
import { prettyJSON } from "hono/pretty-json";
import { secureHeaders } from "hono/secure-headers";
import { OpenAPIHono } from "@hono/zod-openapi";
import { createFiberplane } from "@fiberplane/hono";
import accountHandler from "./handlers/account";
import webhookHandler from "./handlers/webhook";
import companyHandler from "./handlers/company";
import invoiceHandler from "./handlers/invoice";
import bankAccountHandler from "./handlers/bank-account";
import bankTransactionHandler from "./handlers/bank-transaction";
import billHandler from "./handlers/bill";

import {
  withAuth,
  withCors,
  withSentry,
  withTriggerDev,
  withService,
} from "./middleware";
export class Server {
  public readonly routes;

  constructor() {
    const app = new OpenAPIHono<{
      Bindings: {
        NODE_ENV: string;
        DATABASE_URL: string;
        CLERK_SECRET_KEY: string;
        CLERK_PUBLISHABLE_KEY: string;
        CLERK_PUBLIC_JWT_KEY: string;
        WEB_URL: string;
        APP_URL: string;
        QUICK_BOOKS_CLIENT_ID: string;
        QUICK_BOOKS_CLIENT_SECRET: string;
        QUICK_BOOKS_REDIRECT_URI: string;
        QUICK_BOOKS_ENVIRONMENT: "sandbox" | "production";
        PLAID_CLIENT_ID: string;
        PLAID_SECRET: string;
        PLAID_WEBHOOK_URL: string;
        PLAID_ENVIRONMENT: "sandbox" | "production";
        SENTRY_DSN: string;
        SENTRY_ENVIRONMENT: "development" | "staging" | "production";
        TRIGGER_SECRET_KEY: string;
      };
    }>({
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
      .use("*", withCors())
      .use("*", withSentry())
      .use("*", withTriggerDev())
      .use("*", withService())
      .use("*", withAuth());

    app.openAPIRegistry.registerComponent("securitySchemes", "Bearer", {
      type: "http",
      scheme: "bearer",
      bearerFormat: "JWT",
    });

    app.doc("/openapi.json", {
      openapi: "3.0.0",
      info: {
        title: "FundLevel API",
        version: "1.0.0",
        description: "FundLevel API",
      },
    });

    this.routes = app
      .route("/account", accountHandler)
      .route("/webhooks", webhookHandler)
      .route("/company", companyHandler)
      .route("/invoice", invoiceHandler)
      .route("/bill", billHandler)
      .route("/bank-account", bankAccountHandler)
      .route("/bank-transaction", bankTransactionHandler);

    //! It is important to mount Fiberplane's middleware after all of your route definitions.
    app.use(
      "/docs/*",
      createFiberplane({
        openapi: {
          url: "/openapi.json",
        },
      }),
    );
  }
}
