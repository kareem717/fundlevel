import { OpenAPIHono } from "@hono/zod-openapi";
import {
  createCompanyRoute,
  getCompaniesByAccountIdRoute,
  connectQuickBooksRoute,
  quickBooksCallbackRoute,
  getCompanyByIdRoute,
  createPlaidLinkTokenRoute,
  swapPlaidPublicTokenRoute,
} from "./route";
import { getAccount } from "../../middleware/with-auth";
import { getService } from "../../middleware/with-service-layer";
import { tasks, idempotencyKeys } from "@trigger.dev/sdk/v3";
import type {
  syncCompanyBankingDataTask,
  syncCompanyInvoicesTask,
} from "@fundlevel/api/internal/jobs";

const companyHandler = new OpenAPIHono()
  .openapi(createCompanyRoute, async (c) => {
    const account = getAccount(c);

    if (!account) {
      return c.json(
        {
          error: "Account not found.",
        },
        401,
      );
    }

    const input = c.req.valid("json");
    const company = await getService(c).company.create(input, account.id);

    return c.json(company, 201);
  })
  .openapi(getCompaniesByAccountIdRoute, async (c) => {
    const account = getAccount(c);

    if (!account) {
      return c.json(
        {
          error: "Account not found.",
        },
        401,
      );
    }

    const companies = await getService(c).company.getMany({
      ownerId: account.id,
    });

    return c.json(companies || [], 200);
  })
  .openapi(connectQuickBooksRoute, async (c) => {
    const account = getAccount(c);

    if (!account) {
      return c.json(
        {
          error: "Account not found.",
        },
        401,
      );
    }

    const { companyId, redirectUrl } = c.req.valid("json");
    const url = await getService(c).company.startQuickBooksOAuthFlow(
      companyId,
      redirectUrl,
    );

    return c.json({ url: url as string }, 200);
  })
  .openapi(quickBooksCallbackRoute, async (c) => {
    const { realmId, code, state } = c.req.valid("query");

    if (!realmId || !code || !state) {
      return c.json(
        {
          message: `Missing required parameters: ${!realmId ? "realmId" : ""} ${!code ? "code" : ""} ${!state ? "state" : ""}`,
        },
        400,
      );
    }

    const { redirect_url, company_id } = await getService(
      c,
    ).company.completeQuickBooksOAuthFlow(code, state, realmId);

    await tasks.trigger<typeof syncCompanyInvoicesTask>(
      "sync-company-invoices",
      {
        companyId: company_id,
      },
      // {
      //   idempotencyKey: await idempotencyKeys.create(
      //     `sync-company-invoices-${company_id}`,
      //   ),
      // },
    );

    return c.redirect(redirect_url);
  })
  .openapi(getCompanyByIdRoute, async (c) => {
    const account = getAccount(c);

    if (!account) {
      return c.json(
        {
          error: "Account not found.",
        },
        401,
      );
    }

    const { companyId } = c.req.valid("param");
    const company = await getService(c).company.get(companyId);

    if (!company) {
      return c.json(
        {
          error: "Company not found.",
        },
        404,
      );
    }

    if (company.ownerId !== account.id) {
      return c.json(
        {
          error: "Forbidden from managing this company",
        },
        403,
      );
    }

    return c.json(company, 200);
  })
  .openapi(createPlaidLinkTokenRoute, async (c) => {
    const account = getAccount(c);

    if (!account) {
      return c.json(
        {
          error: "Account not found.",
        },
        401,
      );
    }

    const { companyId } = c.req.valid("param");
    const company = await getService(c).company.get(companyId);

    if (!company) {
      return c.json({ error: "Company not found." }, 404);
    }

    if (company.ownerId !== account.id) {
      return c.json(
        {
          error: "Forbidden from managing this company",
        },
        403,
      );
    }

    const linkToken =
      await getService(c).company.createPlaidLinkToken(companyId);

    return c.json({ linkToken }, 200);
  })
  .openapi(swapPlaidPublicTokenRoute, async (c) => {
    const account = getAccount(c);

    if (!account) {
      return c.json(
        {
          error: "Account not found.",
        },
        401,
      );
    }

    const { companyId } = c.req.valid("param");
    const { publicToken } = c.req.valid("json");
    const company = await getService(c).company.get(companyId);

    if (!company) {
      return c.json({ error: "Company not found." }, 404);
    }

    if (company.ownerId !== account.id) {
      return c.json(
        {
          error: "Forbidden from managing this company",
        },
        403,
      );
    }

    const companyService = getService(c).company;

    const creds = await companyService.swapPlaidPublicToken(
      companyId,
      publicToken,
    );

    await tasks.trigger<typeof syncCompanyBankingDataTask>(
      "sync-company-banking-data",
      {
        companyId,
      },
      // {
      //   idempotencyKey: await idempotencyKeys.create(
      //     `sync-company-banking-data-${companyId}`,
      //   ),
      // },
    );

    return c.json(creds, 200);
  });

export default companyHandler;
