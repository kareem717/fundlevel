import { OpenAPIHono } from "@hono/zod-openapi";
import {
  createCompanyRoute,
  getCompaniesByAccountIdRoute,
  connectQuickBooksRoute,
  quickBooksCallbackRoute,
  getCompanyByIdRoute
} from "./route";
import { getAccount } from "../../middleware/with-account";
import { getService } from "../../middleware/with-service-layer";

const companyHandler = new OpenAPIHono()
  .openapi(createCompanyRoute, async (c) => {
    const account = getAccount(c);

    if (!account) {
      return c.json({
        error: "Account not found.",
      }, 401);
    }

    const input = c.req.valid('json');
    const company = await getService(c).company.create(input, account.id);

    return c.json(company, 201);
  })
  .openapi(getCompaniesByAccountIdRoute, async (c) => {
    const account = getAccount(c);

    if (!account) {
      return c.json({
        error: "Account not found.",
      }, 401);
    }

    const companies = await getService(c).company.getByAccountId(account.id);
    return c.json(companies, 200);
  })
  .openapi(connectQuickBooksRoute, async (c) => {
    const account = getAccount(c);

    if (!account) {
      return c.json({
        error: "Account not found.",
      }, 401);
    }

    const { companyId, redirectUrl } = c.req.valid('json');
    const url = await getService(c).company.startQuickBooksOAuthFlow(
      companyId,
      redirectUrl
    );

    return c.json({ url }, 200);
  })
  .openapi(quickBooksCallbackRoute, async (c) => {
    const { realmId, code, state } = c.req.valid('query');

    if (!realmId || !code || !state) {
      return c.json({
        message: `Missing required parameters: ${!realmId ? "realmId" : ""} ${!code ? "code" : ""} ${!state ? "state" : ""}`
      }, 400);
    }

    const { redirect_url } = await getService(c).company.completeQuickBooksOAuthFlow({
      realmId,
      code,
      state
    });

    return c.redirect(redirect_url);
  })
  .openapi(getCompanyByIdRoute, async (c) => {
    const account = getAccount(c);

    if (!account) {
      return c.json({
        error: "Account not found.",
      }, 401);
    }

    const { companyId } = c.req.valid('param');
    const company = await getService(c).company.getById(companyId);

    if (company.ownerId !== account.id) {
      return c.json({
        error: "Forbidden from managing this company",
      }, 403);
    }

    return c.json(company, 200);
  });

export default companyHandler;
