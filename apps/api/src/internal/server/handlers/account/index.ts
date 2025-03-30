import { OpenAPIHono } from "@hono/zod-openapi";
import { createAccountRoute } from "./routes";
import { getAccountRoute } from "./routes";
import { getAccount, getUserId } from "../../middleware/with-auth";
import { getService } from "../../middleware/with-service-layer";

const accountHandler = new OpenAPIHono()
  .openapi(getAccountRoute, async (c) => {
    const account = getAccount(c);
    if (!account) {
      return c.json(
        {
          error: "Account not found, please create an account.",
        },
        404,
      );
    }

    return c.json(account, 200);
  })
  .openapi(createAccountRoute, async (c) => {
    const userId = getUserId(c);

    if (!userId) {
      return c.json(
        {
          error: "User not found, please login.",
        },
        401,
      );
    }

    const account = await getService(c).account.create({
      ...c.req.valid("json"),
      userId,
    });

    return c.json(account, 200);
  });

export default accountHandler;
