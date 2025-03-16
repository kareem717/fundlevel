import { getAccount } from "../../middleware";
import { OpenAPIHono } from "@hono/zod-openapi";
import {
  connectQuickBooksRoute,
  getByIdRoute,
  getByAccountIdRoute,
  createPlaidLinkTokenRoute,
  createLinkedAccountRoute,
  deletePlaidCredentialsRoute,
  deleteLinkedAccountRoute,
  swapPlaidPublicTokenRoute,
  quickBooksCallback,
} from "./routes";
import type {
  ILinkedAccountService,
} from "../../../service";

const linkedAccountHandler = (
  linkedAccountService: ILinkedAccountService,
) => {
  const app = new OpenAPIHono()
    .openapi(createLinkedAccountRoute, async (c) => {
      const account = getAccount(c);
      if (!account) {
        return c.json(
          {
            error: "Account not found",
          },
          401,
        );
      }

      const params = c.req.valid("json");

      const linkedAccount = await linkedAccountService.create({
        owner_id: account.id,
        ...params,
      });

      return c.json(linkedAccount, 201);
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
    .openapi(createPlaidLinkTokenRoute, async (c) => {
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

      if (linkedAccount.owner_id !== account.id) {
        return c.json(
          {
            error: "Forbidden from managing this account",
          },
          403,
        );
      }
      const linkToken = await linkedAccountService.createPlaidLinkToken({
        linkedAccountId: linkedAccount.id,
      });

      return c.json(
        {
          linkToken,
        },
        200,
      );
    })
    .openapi(connectQuickBooksRoute, async (c) => {
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
      const { redirect_uri } = c.req.valid("query");

      const url = await linkedAccountService.startQuickBooksOAuthFlow(id, redirect_uri);

      return c.json(
        {
          url,
        },
        200,
      );
    })
    .openapi(quickBooksCallback, async (c) => {
      const redirectUrl = await linkedAccountService.completeQuickBooksOAuthFlow(
        c.req.valid("query"),
      );
      return c.redirect(redirectUrl);
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
    .openapi(deletePlaidCredentialsRoute, async (c) => {
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

      // Verify the linked account belongs to the user
      const linkedAccount = await linkedAccountService.getById(id);
      if (!linkedAccount) {
        return c.json(
          {
            error: "Linked account not found",
          },
          404,
        );
      }

      if (linkedAccount.owner_id !== account.id) {
        return c.json(
          {
            error: "Forbidden from managing this account",
          },
          403,
        );
      }

      // Delete the credentials
      await linkedAccountService.deletePlaidCredentials(linkedAccount.id);

      // Return 204 No Content for successful deletion
      return new Response(null, { status: 204 });
    })
    .openapi(deleteLinkedAccountRoute, async (c) => {
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

      // Verify the linked account belongs to the user
      const linkedAccount = await linkedAccountService.getById(id);
      if (!linkedAccount) {
        return c.json(
          {
            error: "Linked account not found",
          },
          404,
        );
      }

      if (linkedAccount.owner_id !== account.id) {
        return c.json(
          {
            error: "Forbidden from managing this account",
          },
          403,
        );
      }

      // Delete the linked account and all associated credentials
      await linkedAccountService.deleteLinkedAccount(linkedAccount.id);

      // Return 204 No Content for successful deletion
      return new Response(null, { status: 204 });
    })
    .openapi(swapPlaidPublicTokenRoute, async (c) => {
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
      const { public_token } = c.req.valid("query");

      // Verify the linked account belongs to the user
      const linkedAccount = await linkedAccountService.getById(id);
      if (!linkedAccount) {
        return c.json(
          {
            error: "Linked account not found",
          },
          404,
        );
      }

      if (linkedAccount.owner_id !== account.id) {
        return c.json(
          {
            error: "Forbidden from managing this account",
          },
          403,
        );
      }

      // Exchange the public token for an access token
      const credentials = await linkedAccountService.createPlaidCredentials({
        linkedAccountId: linkedAccount.id,
        publicToken: public_token,
      });

      return c.json(
        {
          access_token: credentials.access_token,
        },
        201,
      );
    });

  return app;
};

export default linkedAccountHandler;
