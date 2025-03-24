import { OpenAPIHono } from "@hono/zod-openapi";
import {
  getCompanyBankAccountsRoute,
  getBankAccountRoute,
  getTransactionsByBankAccountIdRoute,
  getInvoiceRoute,
  getInvoicesByCompanyIdRoute,
  getAccountingAccountRoute,
  getAccountingAccountsByCompanyIdRoute,
  getAccountingTransactionRoute,
  getAccountingTransactionsByCompanyIdRoute,
  getJournalEntryRoute,
  getJournalEntriesByCompanyIdRoute,
  getVendorCreditRoute,
  getVendorCreditsByCompanyIdRoute,
  getCreditNoteRoute,
  getCreditNotesByCompanyIdRoute,
  getPaymentRoute,
  getPaymentsByCompanyIdRoute
} from "./route";
import { getAccount } from "../../middleware/with-auth";
import { getService } from "../../middleware/with-service-layer";

const accountingHandler = new OpenAPIHono()
  .openapi(getCompanyBankAccountsRoute, async (c) => {
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
        error: "Forbidden from managing this account",
      }, 403);
    }

    const bankAccounts = await getService(c).accounting.getBankAccountsForCompany(company.id);

    return c.json(bankAccounts, 200);

  })
  .openapi(getBankAccountRoute, async (c) => {
    const account = getAccount(c);

    if (!account) {
      return c.json({
        error: "Account not found.",
      }, 401);
    }

    const { bankAccountId } = c.req.valid('param');

    const bankAccount = await getService(c).accounting.getBankAccountDetails(bankAccountId);
    const company = await getService(c).company.getById(bankAccount.companyId);

    if (company.ownerId !== account.id) {
      return c.json({
        error: "Forbidden from managing this account",
      }, 403);
    }

    return c.json(bankAccount, 200);

  })
  .openapi(getTransactionsByBankAccountIdRoute, async (c) => {
    const account = getAccount(c);

    if (!account) {
      return c.json({
        error: "Account not found.",
      }, 401);
    }

    const { bankAccountId } = c.req.valid('param');

    const bankAccount = await getService(c).accounting.getBankAccountDetails(bankAccountId);
    const company = await getService(c).company.getById(bankAccount.companyId);

    if (company.ownerId !== account.id) {
      return c.json({
        error: "Forbidden from managing this account",
      }, 403);
    }

    const transactions = await getService(c).accounting.getTransactionsByBankAccountId(bankAccountId);

    return c.json(transactions, 200);
  })
  .openapi(getInvoiceRoute, async (c) => {
    const account = getAccount(c);

    if (!account) {
      return c.json({
        error: "Account not found.",
      }, 401);
    }

    const { invoiceId } = c.req.valid('param');

    const invoice = await getService(c).accounting.getInvoice(invoiceId);
    const company = await getService(c).company.getById(invoice.companyId);

    if (company.ownerId !== account.id) {
      return c.json({
        error: "Forbidden from managing this account",
      }, 403);
    }

    return c.json(invoice, 200);
  })
  .openapi(getInvoicesByCompanyIdRoute, async (c) => {
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
        error: "Forbidden from managing this account",
      }, 403);
    }

    const invoices = await getService(c).accounting.getInvoicesByCompanyId(companyId);

    return c.json(invoices, 200);
  })
  .openapi(getAccountingAccountRoute, async (c) => {
    const account = getAccount(c);

    if (!account) {
      return c.json({
        error: "Account not found.",
      }, 401);
    }

    const { accountId } = c.req.valid('param');

    const accountingAccount = await getService(c).accounting.getAccountingAccount(accountId);
    const company = await getService(c).company.getById(accountingAccount.companyId);

    if (company.ownerId !== account.id) {
      return c.json({
        error: "Forbidden from managing this account",
      }, 403);
    }

    return c.json(accountingAccount, 200);
  })
  .openapi(getAccountingAccountsByCompanyIdRoute, async (c) => {
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
        error: "Forbidden from managing this account",
      }, 403);
    }

    const accounts = await getService(c).accounting.getAccountingAccountsByCompanyId(companyId);

    return c.json(accounts, 200);
  })
  .openapi(getAccountingTransactionRoute, async (c) => {
    const account = getAccount(c);

    if (!account) {
      return c.json({
        error: "Account not found.",
      }, 401);
    }

    const { transactionId } = c.req.valid('param');

    const transaction = await getService(c).accounting.getAccountingTransaction(transactionId);
    const company = await getService(c).company.getById(transaction.companyId);

    if (company.ownerId !== account.id) {
      return c.json({
        error: "Forbidden from managing this account",
      }, 403);
    }

    return c.json(transaction, 200);
  })
  .openapi(getAccountingTransactionsByCompanyIdRoute, async (c) => {
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
        error: "Forbidden from managing this account",
      }, 403);
    }

    const transactions = await getService(c).accounting.getAccountingTransactionsByCompanyId(companyId);

    return c.json(transactions, 200);
  })
  .openapi(getJournalEntryRoute, async (c) => {
    const account = getAccount(c);

    if (!account) {
      return c.json({
        error: "Account not found.",
      }, 401);
    }

    const { journalEntryId } = c.req.valid('param');

    const journalEntry = await getService(c).accounting.getJournalEntry(journalEntryId);
    const company = await getService(c).company.getById(journalEntry.companyId);

    if (company.ownerId !== account.id) {
      return c.json({
        error: "Forbidden from managing this account",
      }, 403);
    }

    return c.json(journalEntry, 200);
  })
  .openapi(getJournalEntriesByCompanyIdRoute, async (c) => {
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
        error: "Forbidden from managing this account",
      }, 403);
    }

    const journalEntries = await getService(c).accounting.getJournalEntriesByCompanyId(companyId);

    return c.json(journalEntries, 200);
  })
  .openapi(getVendorCreditRoute, async (c) => {
    const account = getAccount(c);

    if (!account) {
      return c.json({
        error: "Account not found.",
      }, 401);
    }

    const { vendorCreditId } = c.req.valid('param');

    const vendorCredit = await getService(c).accounting.getVendorCredit(vendorCreditId);
    const company = await getService(c).company.getById(vendorCredit.companyId);

    if (company.ownerId !== account.id) {
      return c.json({
        error: "Forbidden from managing this account",
      }, 403);
    }

    return c.json(vendorCredit, 200);
  })
  .openapi(getVendorCreditsByCompanyIdRoute, async (c) => {
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
        error: "Forbidden from managing this account",
      }, 403);
    }

    const vendorCredits = await getService(c).accounting.getVendorCreditsByCompanyId(companyId);

    return c.json(vendorCredits, 200);
  })
  .openapi(getCreditNoteRoute, async (c) => {
    const account = getAccount(c);

    if (!account) {
      return c.json({
        error: "Account not found.",
      }, 401);
    }

    const { creditNoteId } = c.req.valid('param');

    const creditNote = await getService(c).accounting.getCreditNote(creditNoteId);
    const company = await getService(c).company.getById(creditNote.companyId);

    if (company.ownerId !== account.id) {
      return c.json({
        error: "Forbidden from managing this account",
      }, 403);
    }

    return c.json(creditNote, 200);
  })
  .openapi(getCreditNotesByCompanyIdRoute, async (c) => {
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
        error: "Forbidden from managing this account",
      }, 403);
    }

    const creditNotes = await getService(c).accounting.getCreditNotesByCompanyId(companyId);

    return c.json(creditNotes, 200);
  })
  .openapi(getPaymentRoute, async (c) => {
    const account = getAccount(c);

    if (!account) {
      return c.json({
        error: "Account not found.",
      }, 401);
    }

    const { paymentId } = c.req.valid('param');

    const payment = await getService(c).accounting.getPayment(paymentId);
    const company = await getService(c).company.getById(payment.companyId);

    if (company.ownerId !== account.id) {
      return c.json({
        error: "Forbidden from managing this account",
      }, 403);
    }

    return c.json(payment, 200);
  })
  .openapi(getPaymentsByCompanyIdRoute, async (c) => {
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
        error: "Forbidden from managing this account",
      }, 403);
    }

    const payments = await getService(c).accounting.getPaymentsByCompanyId(companyId);

    return c.json(payments, 200);
  });

export default accountingHandler;
