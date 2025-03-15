import { getAccount } from "../../middleware";
import { OpenAPIHono } from "@hono/zod-openapi";
import {
  swapPublicTokenRoute,
  createLinkTokenRoute,
  getByIdRoute,
  getByAccountIdRoute,
} from "./routes";
import type { ILinkedAccountService } from "../../../service";

const linkedAccountHandler = (linkedAccountService: ILinkedAccountService) => {
  const app = new OpenAPIHono()
    .openapi(createLinkTokenRoute, async (c) => {
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
        organizationName: name,
      });

      return c.json(
        {
          linkToken,
        },
        200,
      );
    })
    .openapi(swapPublicTokenRoute, async (c) => {
      const account = getAccount(c);

      if (!account) {
        return c.json(
          {
            error: "Account not found",
          },
          401,
        );
      }

      const { publicToken } = c.req.valid("query");

      const record = await linkedAccountService.swapPublicToken({
        accountId: account.id,
        publicToken,
      });

      return c.json(record, 200);
    })
    .openapi(getByAccountIdRoute, async (c) => {
      const account = getAccount(c);
      if (!account) {
        return c.json(
          {
            error: "Account not found",
          },
          401,
        );
      }

      const linkedAccounts = await linkedAccountService.getByAccountId(
        account.id,
      );
      return c.json(linkedAccounts, 200);
    })
    .openapi(getByIdRoute, async (c) => {
      const account = getAccount(c);
      if (!account) {
        return c.json(
          {
            error: "Account not found",
          },
          401,
        );
      }

      const { id } = c.req.valid("param");
      const linkedAccount = await linkedAccountService.getById(id);

      return c.json(linkedAccount, 200);
    })


  return app;
};

export default linkedAccountHandler;
