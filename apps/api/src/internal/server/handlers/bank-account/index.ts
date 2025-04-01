import { OpenAPIHono } from "@hono/zod-openapi";
import {
  getBankAccountDetailsRoute,
  getCompanyBankAccountsRoute,
  getCompanyBalanceRoute,
} from "./routes";
import { getAccount } from "../../middleware/with-auth";
import { getService } from "../../middleware/with-service-layer";

const bankAccountHandler = new OpenAPIHono()
  .openapi(getBankAccountDetailsRoute, async (c) => {
    const account = getAccount(c);
    if (!account) {
      return c.json(
        { error: "Account not found, please create an account." },
        404,
      );
    }

    const { id } = c.req.valid("param");

    const result = await getService(c).bankAccount.get({ id });

    if (!result) {
      return c.json(
        { error: "Bank account not found." },
        404,
      );
    }

    const company = await getService(c).company.get(result.companyId);
    if (!company) {
      return c.json(
        { error: "Company not found." },
        404,
      );
    }

    if (company.ownerId !== account.id) {
      return c.json(
        { error: "You are not authorized to access this bank account." },
        403,
      );
    }

    return c.json(result, 200);
  })
  .openapi(getCompanyBankAccountsRoute, async (c) => {
    const account = getAccount(c);
    if (!account) {
      return c.json(
        { error: "Account not found, please create an account." },
        404,
      );
    }

    const result = await getService(c).bankAccount.getMany({
      ...c.req.valid("query"),
      companyIds: [c.req.valid("param").companyId],
    });

    return c.json(result, 200);
  })
  .openapi(getCompanyBalanceRoute, async (c) => {
    const account = getAccount(c);
    if (!account) {
      return c.json(
        { error: "Account not found, please create an account." },
        404,
      );
    }

    const { companyId } = c.req.valid("param");

    const company = await getService(c).company.get(companyId);
    if (!company) {
      return c.json(
        { error: "Company not found." },
        404,
      );
    }

    if (company.ownerId !== account.id) {
      return c.json(
        { error: "You are not authorized to access this company." },
        403,
      );
    }

    const result = await getService(c).bankAccount.getCompanyBalance(companyId);

    return c.json(result, 200);
  });

export default bankAccountHandler;
