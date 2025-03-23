import { OpenAPIHono } from "@hono/zod-openapi";
import { IAuthService } from "@fundlevel/api/internal/service";
import { createAccountRoute } from "./routes";
import { getAccountRoute } from "./routes";
import { getAccount } from "../../middleware/with-account";
import { getAuth } from "@hono/clerk-auth";
import { getService } from "../../middleware/with-service-layer";

const authHandler = new OpenAPIHono()
  .openapi(getAccountRoute, async (c) => {
    const auth = getAuth(c);
    const account = getAccount(c);

    if (!auth?.userId) {
      return c.json({
        error: "User not found, please login.",
      }, 401);
    }

    if (!account) {
      return c.json({
        error: "Account not found, please create an account.",
      }, 404);
    }

    return c.json(account, 200);
  })
  .openapi(createAccountRoute, async (c) => {
    const auth = getAuth(c);

    if (!auth?.userId) {
      return c.json({
        error: "User not found, please login.",
      }, 401);
    }

    const account = await getService(c).auth.createAccount({
      ...c.req.valid('json'),
      userId: auth.userId,
    });

    return c.json(account, 200);
  });


export default authHandler;