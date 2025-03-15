import { getAccount, getUser } from "../../middleware";
import { OpenAPIHono } from "@hono/zod-openapi";
import { swapPublicTokenRoute, createLinkTokenRoute } from "./routes";
import type { IAccountService, ILinkedAccountService } from "../../../service";

const linkedAccountHandler = (linkedAccountService: ILinkedAccountService) => {
  const app = new OpenAPIHono().openapi(createLinkTokenRoute, async (c) => {
    const account = getAccount(c);
    if (!account) {
      return c.json(
        {
          error: "Account not found",
        },
        401,
      );
    }

    const { name } = c.req.valid("query");
    const linkToken = await linkedAccountService.createLinkToken({
      accountId: account.id,
      organizationName: name
    })


    return c.json({
      linkToken
    }, 200);
  }).openapi(swapPublicTokenRoute, async (c) => {
    const account = getAccount(c);

    if (!account) {
      return c.json(
        {
          error: "Account not found",
        },
        401,
      );
    }

    const { publicToken } = c.req.valid("query")

    const record = await linkedAccountService.swapPublicToken({
      accountId: account.id,
      publicToken
    })

    return c.json(record, 200);
  });

  return app;
};

export default linkedAccountHandler;
