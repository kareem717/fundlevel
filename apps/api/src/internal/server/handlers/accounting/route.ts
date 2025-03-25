import { z, createRoute } from "@hono/zod-openapi";
import {
  unauthorizedResponse,
  forbiddenResponse,
} from "@fundlevel/api/internal/server/types/errors";
import { bearerAuthSchema } from "@fundlevel/api/internal/server/types/security";
import {
  PlaidBankAccountSchema,
  PlaidTransactionSchema,
  QuickBooksAccountSchema,
  QuickBooksCreditNoteSchema,
  QuickBooksInvoiceSchema,
  QuickBooksJournalEntrySchema,
  QuickBooksPaymentSchema,
  QuickBooksTransactionSchema,
  QuickBooksVendorCreditSchema,
} from "@fundlevel/db/validators";

const intIdSchema = z.coerce.number().int().positive();
const stringIdSchema = z.string().min(1);

export const getCompanyBankAccountsRoute = createRoute({
  summary: "Get company bank accounts",
  operationId: "getCompanyBankAccounts",
  tags: ["Accounting"],
  security: [bearerAuthSchema],
  method: "get",
  path: "/bank-accounts/company/:companyId",
  request: {
    params: z.object({
      companyId: intIdSchema.describe("The ID of the company"),
    }),
  },
  responses: {
    200: {
      description: "Successful fetch",
      content: {
        "application/json": {
          schema: z.array(PlaidBankAccountSchema.openapi("BankAccount")),
        },
      },
    },
    ...unauthorizedResponse,
    ...forbiddenResponse,
  },
});

export const getBankAccountRoute = createRoute({
  summary: "Get bank account details",
  operationId: "getBankAccount",
  tags: ["Accounting"],
  security: [bearerAuthSchema],
  method: "get",
  path: "/bank-accounts/:bankAccountId",
  request: {
    params: z.object({
      bankAccountId: stringIdSchema.describe("The ID of the bank account"),
    }),
  },
  responses: {
    200: {
      description: "Successful fetch",
      content: {
        "application/json": {
          schema: PlaidBankAccountSchema.openapi("BankAccount"),
        },
      },
    },
    ...unauthorizedResponse,
    ...forbiddenResponse,
  },
});

export const getBankAccountTransactionDetailsRoute = createRoute({
  summary: "Get bank account transaction details",
  operationId: "getBankAccountTransactionDetails",
  tags: ["Accounting"],
  security: [bearerAuthSchema],
  method: "get",
  path: "/bank-accounts/:bankAccountId/transaction-details",
  request: {
    params: z.object({
      bankAccountId: stringIdSchema.describe("The ID of the bank account"),
    }),
  },
  responses: {
    200: {
      description: "Successful fetch",
      content: {
        "application/json": {
          schema: z.object({
            totalVolume: z.number(),
            accountedAmount: z.number(),
            unaccountedAmount: z.number(),
            unaccountedPercentage: z.number(),
          }),
        },
      },
    },
    ...unauthorizedResponse,
    ...forbiddenResponse,
  },
});

export const getTransactionsByBankAccountIdRoute = createRoute({
  summary: "Get transactions by bank account ID",
  operationId: "getTransactionsByBankAccountId",
  tags: ["Accounting"],
  security: [bearerAuthSchema],
  method: "get",
  path: "/bank-accounts/:bankAccountId/transactions",
  request: {
    params: z.object({
      bankAccountId: stringIdSchema.describe("The ID of the bank account"),
    }),
  },
  responses: {
    200: {
      description: "Successful fetch",
      content: {
        "application/json": {
          schema: z.array(PlaidTransactionSchema.openapi("Transaction")),
        },
      },
    },
    ...unauthorizedResponse,
    ...forbiddenResponse,
  },
});

export const getInvoiceRoute = createRoute({
  summary: "Get invoice details",
  operationId: "getInvoice",
  tags: ["Accounting"],
  security: [bearerAuthSchema],
  method: "get",
  path: "/invoices/:invoiceId",
  request: {
    params: z.object({
      invoiceId: intIdSchema.describe("The ID of the invoice"),
    }),
  },
  responses: {
    200: {
      description: "Successful fetch",
      content: {
        "application/json": {
          schema: QuickBooksInvoiceSchema.openapi("Invoice"),
        },
      },
    },
    ...unauthorizedResponse,
    ...forbiddenResponse,
  },
});

export const getInvoicesByCompanyIdRoute = createRoute({
  summary: "Get invoices by company ID",
  operationId: "getInvoicesByCompanyId",
  tags: ["Accounting"],
  security: [bearerAuthSchema],
  method: "get",
  path: "/companies/:companyId/invoices",
  request: {
    params: z.object({
      companyId: intIdSchema.describe("The ID of the company"),
    }),
  },
  responses: {
    200: {
      description: "Successful fetch",
      content: {
        "application/json": {
          schema: z.array(QuickBooksInvoiceSchema.openapi("Invoice")),
        },
      },
    },
    ...unauthorizedResponse,
    ...forbiddenResponse,
  },
});

export const getAccountingAccountRoute = createRoute({
  summary: "Get accounting account details",
  operationId: "getAccountingAccount",
  tags: ["Accounting"],
  security: [bearerAuthSchema],
  method: "get",
  path: "/accounts/:accountId",
  request: {
    params: z.object({
      accountId: intIdSchema.describe("The ID of the accounting account"),
    }),
  },
  responses: {
    200: {
      description: "Successful fetch",
      content: {
        "application/json": {
          schema: QuickBooksAccountSchema.openapi("AccountingAccount"),
        },
      },
    },
    ...unauthorizedResponse,
    ...forbiddenResponse,
  },
});

export const getAccountingAccountsByCompanyIdRoute = createRoute({
  summary: "Get accounting accounts by company ID",
  operationId: "getAccountingAccountsByCompanyId",
  tags: ["Accounting"],
  security: [bearerAuthSchema],
  method: "get",
  path: "/companies/:companyId/accounts",
  request: {
    params: z.object({
      companyId: intIdSchema.describe("The ID of the company"),
    }),
  },
  responses: {
    200: {
      description: "Successful fetch",
      content: {
        "application/json": {
          schema: z.array(QuickBooksAccountSchema.openapi("AccountingAccount")),
        },
      },
    },
    ...unauthorizedResponse,
    ...forbiddenResponse,
  },
});

export const getAccountingTransactionRoute = createRoute({
  summary: "Get accounting transaction details",
  operationId: "getAccountingTransaction",
  tags: ["Accounting"],
  security: [bearerAuthSchema],
  method: "get",
  path: "/transactions/:transactionId",
  request: {
    params: z.object({
      transactionId: intIdSchema.describe(
        "The ID of the accounting transaction",
      ),
    }),
  },
  responses: {
    200: {
      description: "Successful fetch",
      content: {
        "application/json": {
          schema: QuickBooksTransactionSchema.openapi("Transaction"),
        },
      },
    },
    ...unauthorizedResponse,
    ...forbiddenResponse,
  },
});

export const getAccountingTransactionsByCompanyIdRoute = createRoute({
  summary: "Get accounting transactions by company ID",
  operationId: "getAccountingTransactionsByCompanyId",
  tags: ["Accounting"],
  security: [bearerAuthSchema],
  method: "get",
  path: "/companies/:companyId/transactions",
  request: {
    params: z.object({
      companyId: intIdSchema.describe("The ID of the company"),
    }),
  },
  responses: {
    200: {
      description: "Successful fetch",
      content: {
        "application/json": {
          schema: z.array(QuickBooksTransactionSchema.openapi("Transaction")),
        },
      },
    },
    ...unauthorizedResponse,
    ...forbiddenResponse,
  },
});

export const getJournalEntryRoute = createRoute({
  summary: "Get journal entry details",
  operationId: "getJournalEntry",
  tags: ["Accounting"],
  security: [bearerAuthSchema],
  method: "get",
  path: "/journal-entries/:journalEntryId",
  request: {
    params: z.object({
      journalEntryId: intIdSchema.describe("The ID of the journal entry"),
    }),
  },
  responses: {
    200: {
      description: "Successful fetch",
      content: {
        "application/json": {
          schema: QuickBooksJournalEntrySchema.openapi("JournalEntry"),
        },
      },
    },
    ...unauthorizedResponse,
    ...forbiddenResponse,
  },
});

export const getJournalEntriesByCompanyIdRoute = createRoute({
  summary: "Get journal entries by company ID",
  operationId: "getJournalEntriesByCompanyId",
  tags: ["Accounting"],
  security: [bearerAuthSchema],
  method: "get",
  path: "/companies/:companyId/journal-entries",
  request: {
    params: z.object({
      companyId: intIdSchema.describe("The ID of the company"),
    }),
  },
  responses: {
    200: {
      description: "Successful fetch",
      content: {
        "application/json": {
          schema: z.array(QuickBooksJournalEntrySchema.openapi("JournalEntry")),
        },
      },
    },
    ...unauthorizedResponse,
    ...forbiddenResponse,
  },
});

export const getVendorCreditRoute = createRoute({
  summary: "Get vendor credit details",
  operationId: "getVendorCredit",
  tags: ["Accounting"],
  security: [bearerAuthSchema],
  method: "get",
  path: "/vendor-credits/:vendorCreditId",
  request: {
    params: z.object({
      vendorCreditId: intIdSchema.describe("The ID of the vendor credit"),
    }),
  },
  responses: {
    200: {
      description: "Successful fetch",
      content: {
        "application/json": {
          schema: QuickBooksVendorCreditSchema.openapi("VendorCredit"),
        },
      },
    },
    ...unauthorizedResponse,
    ...forbiddenResponse,
  },
});

export const getVendorCreditsByCompanyIdRoute = createRoute({
  summary: "Get vendor credits by company ID",
  operationId: "getVendorCreditsByCompanyId",
  tags: ["Accounting"],
  security: [bearerAuthSchema],
  method: "get",
  path: "/companies/:companyId/vendor-credits",
  request: {
    params: z.object({
      companyId: intIdSchema.describe("The ID of the company"),
    }),
  },
  responses: {
    200: {
      description: "Successful fetch",
      content: {
        "application/json": {
          schema: z.array(QuickBooksVendorCreditSchema.openapi("VendorCredit")),
        },
      },
    },
    ...unauthorizedResponse,
    ...forbiddenResponse,
  },
});

export const getCreditNoteRoute = createRoute({
  summary: "Get credit note details",
  operationId: "getCreditNote",
  tags: ["Accounting"],
  security: [bearerAuthSchema],
  method: "get",
  path: "/credit-notes/:creditNoteId",
  request: {
    params: z.object({
      creditNoteId: intIdSchema.describe("The ID of the credit note"),
    }),
  },
  responses: {
    200: {
      description: "Successful fetch",
      content: {
        "application/json": {
          schema: QuickBooksCreditNoteSchema.openapi("CreditNote"),
        },
      },
    },
    ...unauthorizedResponse,
    ...forbiddenResponse,
  },
});

export const getCreditNotesByCompanyIdRoute = createRoute({
  summary: "Get credit notes by company ID",
  operationId: "getCreditNotesByCompanyId",
  tags: ["Accounting"],
  security: [bearerAuthSchema],
  method: "get",
  path: "/companies/:companyId/credit-notes",
  request: {
    params: z.object({
      companyId: intIdSchema.describe("The ID of the company"),
    }),
  },
  responses: {
    200: {
      description: "Successful fetch",
      content: {
        "application/json": {
          schema: z.array(QuickBooksCreditNoteSchema.openapi("CreditNote")),
        },
      },
    },
    ...unauthorizedResponse,
    ...forbiddenResponse,
  },
});

export const getPaymentRoute = createRoute({
  summary: "Get payment details",
  operationId: "getPayment",
  tags: ["Accounting"],
  security: [bearerAuthSchema],
  method: "get",
  path: "/payments/:paymentId",
  request: {
    params: z.object({
      paymentId: intIdSchema.describe("The ID of the payment"),
    }),
  },
  responses: {
    200: {
      description: "Successful fetch",
      content: {
        "application/json": {
          schema: QuickBooksPaymentSchema.openapi("Payment"),
        },
      },
    },
    ...unauthorizedResponse,
    ...forbiddenResponse,
  },
});

export const getPaymentsByCompanyIdRoute = createRoute({
  summary: "Get payments by company ID",
  operationId: "getPaymentsByCompanyId",
  tags: ["Accounting"],
  security: [bearerAuthSchema],
  method: "get",
  path: "/companies/:companyId/payments",
  request: {
    params: z.object({
      companyId: intIdSchema.describe("The ID of the company"),
    }),
  },
  responses: {
    200: {
      description: "Successful fetch",
      content: {
        "application/json": {
          schema: z.array(QuickBooksPaymentSchema.openapi("Payment")),
        },
      },
    },
    ...unauthorizedResponse,
    ...forbiddenResponse,
  },
});
