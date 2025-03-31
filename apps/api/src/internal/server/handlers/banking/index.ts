import { OpenAPIHono } from "@hono/zod-openapi";
import {
  getManyCompanyTransactionsRoute,
  getManyBankAccountTransactionsRoute,
  getBankAccountDetailsRoute,
  getCompanyBankAccountsRoute,
  getTransactionRoute,
} from "./routes";
import { getAccount } from "../../middleware/with-auth";
import { getService } from "../../middleware/with-service-layer";

const bankingHandler = new OpenAPIHono()
  .openapi(getManyCompanyTransactionsRoute, async (c) => {
    const account = getAccount(c);
    if (!account) {
      return c.json(
        {
          error: "Account not found, please create an account.",
        },
        404,
      );
    }

    const { companyId } = c.req.valid("param");

    const result = await getService(c).banking.getManyTransactions({
      ...c.req.valid("query"),
      companyIds: [companyId],
      
    });

    return c.json(result, 200);
  })
  .openapi(getManyBankAccountTransactionsRoute, async (c) => {
    const account = getAccount(c);
    if (!account) {
      return c.json(
        { error: "Account not found, please create an account." },
        404,
      );
    }

    console.log(c.req.valid("param"));
    const { bankAccountId } = c.req.valid("param");

    const result = await getService(c).banking.getManyTransactions({
      ...c.req.valid("query"),
      bankAccountIds: [bankAccountId],
    });

    return c.json(result, 200);
  })
  .openapi(getBankAccountDetailsRoute, async (c) => {
    const account = getAccount(c);
    if (!account) {
      return c.json(
        { error: "Account not found, please create an account." },
        404,
      );
    }

    const { bankAccountId } = c.req.valid("param");

    const result = await getService(c).banking.getBankAccount(bankAccountId);

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

    const result = await getService(c).banking.getManyBankAccounts({
      ...c.req.valid("query"),
      companyIds: [c.req.valid("param").companyId],
    });

    return c.json(result, 200);
  })
  .openapi(getTransactionRoute, async (c) => {
    const account = getAccount(c);
    if (!account) {
      return c.json({ error: "Account not found, please create an account." }, 404);
    }

    const { transactionId } = c.req.valid("param");

    const result = await getService(c).banking.getTransaction(transactionId);

    if (!result) {
      return c.json({ error: "Transaction not found." }, 404);
    }

    const company = await getService(c).company.get(result.companyId);
    if (!company) {
      return c.json({ error: "Company not found." }, 404);
    }

    if (company.ownerId !== account.id) {
      return c.json({ error: "You are not authorized to access this transaction." }, 403);
    }

    return c.json(result, 200);
  });

export default bankingHandler;
