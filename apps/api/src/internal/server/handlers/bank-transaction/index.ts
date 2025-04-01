import { OpenAPIHono } from "@hono/zod-openapi";
import {
  getCompanyTransactionsRoute,
  getBankAccountTransactionsRoute,
  getTransactionRoute,
  createTransactionRelationshipRoute,
} from "./routes";
import { getAccount } from "../../middleware/with-auth";
import { getService } from "../../middleware/with-service-layer";

const bankingHandler = new OpenAPIHono()
  .openapi(getCompanyTransactionsRoute, async (c) => {
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

    const result = await getService(c).bankTransaction.getMany({
      ...c.req.valid("query"),
      companyIds: [companyId],
    });

    return c.json(result, 200);
  })
  .openapi(getBankAccountTransactionsRoute, async (c) => {
    const account = getAccount(c);
    if (!account) {
      return c.json(
        { error: "Account not found, please create an account." },
        404,
      );
    }

    const { bankAccountId } = c.req.valid("param");

    const result = await getService(c).bankTransaction.getMany({
      ...c.req.valid("query"),
      bankAccountIds: [bankAccountId],
    });

    return c.json(result, 200);
  })
  .openapi(getTransactionRoute, async (c) => {
    const account = getAccount(c);
    if (!account) {
      return c.json({ error: "Account not found, please create an account." }, 404);
    }

    const { id } = c.req.valid("param");

    const result = await getService(c).bankTransaction.get({ id });

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
  })
  .openapi(createTransactionRelationshipRoute, async (c) => {
    const account = getAccount(c);
    if (!account) {
      return c.json({ error: "Account not found, please create an account." }, 404);
    }

    const { id } = c.req.valid("param");
    const params = c.req.valid("json");

    const isValid = await getService(c).bankTransaction.validateOwnership(id, account.id);
    if (!isValid) {
      return c.json({ error: "You are not authorized to access this transaction." }, 403);
    }

    await getService(c).bankTransaction.createRelationship(params, id);

    return c.json({ message: "Relationship created." }, 200);
  });

export default bankingHandler;
