import { OpenAPIHono } from "@hono/zod-openapi";
import type { IAccountingService } from "../../../service";
import { getAccount } from "../../middleware/auth";
import {
  getBankAccountsForCompanyRoute,
  getBankAccountRoute,
  getTransactionsRoute,
} from "./routes";

/**
 * Handler for accounting-related endpoints (bank accounts, transactions)
 */
const accountingHandler = (accountingService: IAccountingService) => {
  const app = new OpenAPIHono()
    .openapi(getBankAccountsForCompanyRoute, async (c) => {
      const account = getAccount(c);
      if (!account) {
        return c.json({ error: "Account not found" }, 401);
      }

      const { id } = c.req.valid("param");

      const accounts = await accountingService.getBankAccountsForCompany(id);
      return c.json(accounts , 200);
    })
    .openapi(getBankAccountRoute, async (c) => {
      const account = getAccount(c);
      if (!account) {
        return c.json({ error: "Unauthorized" }, 401);
      }

      const { id } = c.req.valid("param");

      const bankAccount = await accountingService.getBankAccountDetails(id);
      return c.json(bankAccount, 200);
    })
    .openapi(getTransactionsRoute, async (c) => {
      const account = getAccount(c);
      if (!account) {
        return c.json({ error: "Unauthorized" }, 401);
      }

      const { id } = c.req.valid("param");

      const transactions = await accountingService.getTransactionsByBankAccountId(id);
      return c.json(transactions, 200);
    });

  return app;
};

export default accountingHandler;

