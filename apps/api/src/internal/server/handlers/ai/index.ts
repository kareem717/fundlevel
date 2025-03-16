import { OpenAPIHono } from "@hono/zod-openapi";
import { getAccount } from "../../middleware/auth";
import { stream } from "hono/streaming";
import type {
  IAIService,
  IAccountingService,
  ICompanyService,
} from "../../../service";
import {
  analyzeBalanceSheetRoute,
  analyzeFinancialHealthRoute,
  projectCashFlowRoute,
  reconcileTransactionsRoute,
} from "./routes";
import type { Context } from "hono";

/**
 * Setup streaming headers for AI responses
 */
const setupStreamingHeaders = (c: Context) => {
  // Mark the response as a data stream
  c.header("X-Vercel-AI-Data-Stream", "v1");
  c.header("Content-Type", "text/plain; charset=utf-8");
};

/**
 * Handler for AI-powered financial analysis endpoints
 */
const aiHandler = (ai: IAIService, accountingService: IAccountingService, companyService: ICompanyService) => {
  const app = new OpenAPIHono()
    .openapi(analyzeBalanceSheetRoute, async (c) => {
      const account = getAccount(c);
      if (!account) {
        return c.json({ error: "Account not found" }, 401);
      }

      const { messages } = c.req.valid("json");
      const { id } = c.req.valid("param");

      setupStreamingHeaders(c);

      // Type assertion for messages to match the expected Message[] interface
      const dataStream = await ai.analyzeBalanceSheet(messages, id);

      return stream(c, (s) => s.pipe(dataStream));
    })
    .openapi(analyzeFinancialHealthRoute, async (c) => {
      const account = getAccount(c);
      if (!account) {
        return c.json({ error: "Account not found" }, 401);
      }

      const { messages } = await c.req.valid("json");
      const { id } = c.req.valid("param");

      setupStreamingHeaders(c);

      const dataStream = await ai.analyzeFinancialHealth(messages, id);

      return stream(c, (s) => s.pipe(dataStream));
    })
    .openapi(projectCashFlowRoute, async (c) => {
      const account = getAccount(c);
      if (!account) {
        return c.json({ error: "Account not found" }, 401);
      }

      const { messages } = await c.req.valid("json");
      const { id } = c.req.valid("param");

      setupStreamingHeaders(c);

      const dataStream = await ai.projectCashFlow(messages, id);

      return stream(c, (s) => s.pipe(dataStream));
    })
    .openapi(reconcileTransactionsRoute, async (c) => {
      const account = getAccount(c);
      if (!account) {
        return c.json({ error: "Account not found" }, 401);
      }

      const { id } = c.req.valid("param");

      const bankAccount = await accountingService.getAccountDetails(id);
      console.log(bankAccount.company_id);
      const company = await companyService.getById(bankAccount.company_id);
      if (company.owner_id !== account.id) {
        return c.json({ error: "Unauthorized to access this bank account" }, 403);
      }

      // Get the necessary data from the accounting service
      const bankTransactions =
        await accountingService.getTransactions(bankAccount.id);
      const invoices = await accountingService.getInvoicesForCompany(company.id);

      // Perform the reconciliation
      const result = await ai.reconcileTransactions(
        bankTransactions,
        invoices,
        bankAccount,
      );

      console.log(result);
      return c.json(result, 200);
    });

  return app;
};

export default aiHandler;
