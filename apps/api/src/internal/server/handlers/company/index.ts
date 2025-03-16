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
  searchCompaniesRoute,
} from "./routes";
import type { ICompanyService } from "../../../service";

const companyHandler = (companyservice: ICompanyService) => {
  const app = new OpenAPIHono()
    .openapi(searchCompaniesRoute, async (c) => {
      const account = getAccount(c);
      if (!account) {
        return c.json(
          {
            error: "Account not found",
          },
          401,
        );
      }

      const { query } = c.req.valid("query");
      const searchQuery = query || ""; // Default to empty string if no query is provided

      const companies = await companyservice.searchCompanies(
        searchQuery,
        account.id,
      );

      return c.json(companies, 200);
    })
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

      const company = await companyservice.create({
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

      const companies = await companyservice.getByAccountId(account.id);
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

      const company = await companyservice.getById(id);

      if (company.owner_id !== account.id) {
        return c.json(
          {
            error: "Forbidden from managing this account",
          },
          403,
        );
      }
      const linkToken = await companyservice.createPlaidLinkToken({
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

      const url = await companyservice.startQuickBooksOAuthFlow(
        id,
        redirect_uri,
      );

      return c.json(
        {
          url,
        },
        200,
      );
    })
    .openapi(quickBooksCallback, async (c) => {
      const { redirect_url, company_id } =
        await companyservice.completeQuickBooksOAuthFlow(c.req.valid("query"));

      await companyservice.syncQuickBooksInvoices(company_id);
      return c.redirect(redirect_url);
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
      const company = await companyservice.getById(id);

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
      const company = await companyservice.getById(id);
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
      await companyservice.deletePlaidCredentials(company.id);

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
      const company = await companyservice.getById(id);
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
      await companyservice.deleteCompany(company.id);

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
      const company = await companyservice.getById(id);
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
      const { item_id } = await companyservice.createPlaidCredentials({
        companyId: company.id,
        publicToken: public_token,
      });

      await companyservice.syncPlaidTransactions(item_id);
      await companyservice.syncPlaidBankAccounts(item_id);

      return c.json({ success: true }, 201);
    });

  return app;
};

export default companyHandler;
