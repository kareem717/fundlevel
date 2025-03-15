import { getAccount, getUser } from "../../middleware";
import { OpenAPIHono } from "@hono/zod-openapi";
import { createAccountRoute, getAccountRoute } from "./routes";
import type { IAccountService } from "../../../service";

const accountHandler = (accountService: IAccountService) => {
  const app = new OpenAPIHono().openapi(getAccountRoute, async (c) => {
    const account = getAccount(c);

    if (!account) {
      return c.json(
        {
          error: "Account not found",
        },
        404,
      );
    }

    return c.json(account, 200);
  }).openapi(createAccountRoute, async (c) => {
    console.log("here")
    const user = getUser(c);

    if (!user) {
      return c.json(
        {
          error: "User not found",
        },
        401,
      );
    }

    const account = await accountService.create({
      user_id: user.id,
    });

    return c.json(account, 200);
  });

  return app;
};

export default accountHandler;
