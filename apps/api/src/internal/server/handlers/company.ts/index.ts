import { getAccount } from "../../middleware";
import { OpenAPIHono } from "@hono/zod-openapi";
import {
  connectQuickBooksRoute,
  getByIdRoute,
  getByAccountIdRoute,
  createPlaidLinkTokenRoute,
  createCompanyRoute,
  deletePlaidCredentialsRoute,
  deleteCompanyRoute,
  swapPlaidPublicTokenRoute,
  quickBooksCallback,
} from "./routes";
import type {
  ICompanieservice,
} from "../../../service";

const companyHandler = (
  companieservice: ICompanieservice,
) => {
  const app = new OpenAPIHono()
    .openapi(createCompanyRoute, async (c) => {
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

      const company = await companieservice.create({
        owner_id: account.id,
        ...params,
      });

      return c.json(company, 201);
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

      const companies = await companieservice.getByAccountId(
        account.id,
      );
      return c.json(companies, 200);
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

      const company = await companieservice.getById(id);

      if (company.owner_id !== account.id) {
        return c.json(
          {
            error: "Forbidden from managing this account",
          },
          403,
        );
      }
      const linkToken = await companieservice.createPlaidLinkToken({
        companyId: company.id,
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

      const url = await companieservice.startQuickBooksOAuthFlow(id, redirect_uri);

      return c.json(
        {
          url,
        },
        200,
      );
    })
    .openapi(quickBooksCallback, async (c) => {
      const redirectUrl = await companieservice.completeQuickBooksOAuthFlow(
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
      const company = await companieservice.getById(id);

      return c.json(company, 200);
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
      const company = await companieservice.getById(id);
      if (!company) {
        return c.json(
          {
            error: "Linked account not found",
          },
          404,
        );
      }

      if (company.owner_id !== account.id) {
        return c.json(
          {
            error: "Forbidden from managing this account",
          },
          403,
        );
      }

      // Delete the credentials
      await companieservice.deletePlaidCredentials(company.id);

      // Return 204 No Content for successful deletion
      return new Response(null, { status: 204 });
    })
    .openapi(deleteCompanyRoute, async (c) => {
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
      const company = await companieservice.getById(id);
      if (!company) {
        return c.json(
          {
            error: "Linked account not found",
          },
          404,
        );
      }

      if (company.owner_id !== account.id) {
        return c.json(
          {
            error: "Forbidden from managing this account",
          },
          403,
        );
      }

      // Delete the linked account and all associated credentials
      await companieservice.deleteCompany(company.id);

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
      const company = await companieservice.getById(id);
      if (!company) {
        return c.json(
          {
            error: "Linked account not found",
          },
          404,
        );
      }

      if (company.owner_id !== account.id) {
        return c.json(
          {
            error: "Forbidden from managing this account",
          },
          403,
        );
      }

      // Exchange the public token for an access token
      const credentials = await companieservice.createPlaidCredentials({
        companyId: company.id,
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

export default companyHandler;
