import {
  createSelectSchema,
  createUpdateSchema,
  createInsertSchema,
} from "drizzle-zod";
import {
  accounts,
  companies,
  plaidCredentials,
  plaidBankAccounts,
  plaidTransactions,
  quickBooksOauthCredentials,
  quickBooksOauthStates,
  quickBooksJournalEntries,
  quickBooksVendorCredits,
  quickBooksCreditNotes,
  quickBooksPayments,
  quickBooksAccounts,
  quickBooksTransactions
} from "@fundlevel/db/schema";

// Account schemas
const AccountSchema = createSelectSchema(accounts);
const CreateAccountParamsSchema = createInsertSchema(accounts).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
  userId: true,
});
const UpdateAccountParamsSchema = createUpdateSchema(accounts).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
  userId: true,
});

// Company schemas
const CompanySchema = createSelectSchema(companies);
const CreateCompanyParamsSchema = createInsertSchema(companies).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
  ownerId: true,
});
const UpdateCompanyParamsSchema = createUpdateSchema(companies).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
  ownerId: true,
});

// PlaidCredential schemas
const PlaidCredentialSchema = createSelectSchema(plaidCredentials);
const CreatePlaidCredentialParamsSchema = createInsertSchema(
  plaidCredentials,
).omit({ createdAt: true, updatedAt: true, companyId: true });
const UpdatePlaidCredentialParamsSchema = createUpdateSchema(
  plaidCredentials,
).omit({ createdAt: true, updatedAt: true, companyId: true });

// PlaidBankAccount schemas
const PlaidBankAccountSchema = createSelectSchema(plaidBankAccounts);
const CreatePlaidBankAccountParamsSchema = createInsertSchema(
  plaidBankAccounts,
).omit({ createdAt: true, updatedAt: true, companyId: true });
const UpdatePlaidBankAccountParamsSchema = createUpdateSchema(
  plaidBankAccounts,
).omit({ createdAt: true, updatedAt: true, companyId: true });

// PlaidTransaction schemas
const PlaidTransactionSchema = createSelectSchema(plaidTransactions);
const CreatePlaidTransactionParamsSchema = createInsertSchema(
  plaidTransactions,
).omit({ createdAt: true, updatedAt: true, companyId: true });
const UpdatePlaidTransactionParamsSchema = createUpdateSchema(
  plaidTransactions,
).omit({ createdAt: true, updatedAt: true, companyId: true });

// QuickBooksOauthCredential schemas
const QuickBooksOauthCredentialSchema = createSelectSchema(
  quickBooksOauthCredentials,
);
const CreateQuickBooksOauthCredentialParamsSchema = createInsertSchema(
  quickBooksOauthCredentials,
).omit({ createdAt: true, updatedAt: true, companyId: true });
const UpdateQuickBooksOauthCredentialParamsSchema = createUpdateSchema(
  quickBooksOauthCredentials,
).omit({ createdAt: true, updatedAt: true, companyId: true, realmId: true });

// QuickBooksOauthState schemas
const QuickBooksOauthStateSchema = createSelectSchema(
  quickBooksOauthStates,
);
const CreateQuickBooksOauthStateParamsSchema = createInsertSchema(
  quickBooksOauthStates,
).omit({ companyId: true });
const UpdateQuickBooksOauthStateParamsSchema = createUpdateSchema(
  quickBooksOauthStates,
).omit({ companyId: true });

// QuickBooksJournalEntry schemas
const QuickBooksJournalEntrySchema = createSelectSchema(
  quickBooksJournalEntries,
);
const CreateQuickBooksJournalEntryParamsSchema = createInsertSchema(
  quickBooksJournalEntries,
).omit({ id: true, createdAt: true, updatedAt: true, companyId: true });
const UpdateQuickBooksJournalEntryParamsSchema = createUpdateSchema(
  quickBooksJournalEntries,
).omit({ id: true, createdAt: true, updatedAt: true, companyId: true });

// QuickBooksVendorCredit schemas
const QuickBooksVendorCreditSchema = createSelectSchema(
  quickBooksVendorCredits,
);
const CreateQuickBooksVendorCreditParamsSchema = createInsertSchema(
  quickBooksVendorCredits,
).omit({ id: true, createdAt: true, updatedAt: true, companyId: true });
const UpdateQuickBooksVendorCreditParamsSchema = createUpdateSchema(
  quickBooksVendorCredits,
).omit({ id: true, createdAt: true, updatedAt: true, companyId: true });

// QuickBooksCreditNote schemas
const QuickBooksCreditNoteSchema = createSelectSchema(
  quickBooksCreditNotes,
);
const CreateQuickBooksCreditNoteParamsSchema = createInsertSchema(
  quickBooksCreditNotes,
).omit({ id: true, createdAt: true, updatedAt: true, companyId: true });
const UpdateQuickBooksCreditNoteParamsSchema = createUpdateSchema(
  quickBooksCreditNotes,
).omit({ id: true, createdAt: true, updatedAt: true, companyId: true });

// QuickBooksPayment schemas
const QuickBooksPaymentSchema = createSelectSchema(quickBooksPayments);
const CreateQuickBooksPaymentParamsSchema = createInsertSchema(
  quickBooksPayments,
).omit({ id: true, createdAt: true, updatedAt: true, companyId: true });
const UpdateQuickBooksPaymentParamsSchema = createUpdateSchema(
  quickBooksPayments,
).omit({ id: true, createdAt: true, updatedAt: true, companyId: true });

// QuickBooksAccount schemas
const QuickBooksAccountSchema = createSelectSchema(quickBooksAccounts);
const CreateQuickBooksAccountParamsSchema = createInsertSchema(
  quickBooksAccounts,
).omit({ id: true, createdAt: true, updatedAt: true, companyId: true });
const UpdateQuickBooksAccountParamsSchema = createUpdateSchema(
  quickBooksAccounts,
).omit({ id: true, createdAt: true, updatedAt: true, companyId: true });

// QuickBooksTransaction schemas
const QuickBooksTransactionSchema = createSelectSchema(
  quickBooksTransactions,
);
const CreateQuickBooksTransactionParamsSchema = createInsertSchema(
  quickBooksTransactions,
).omit({ id: true, createdAt: true, updatedAt: true, companyId: true });
const UpdateQuickBooksTransactionParamsSchema = createUpdateSchema(
  quickBooksTransactions,
).omit({ id: true, createdAt: true, updatedAt: true, companyId: true });

export * from "./invoice";
export {
  AccountSchema,
  CreateAccountParamsSchema,
  UpdateAccountParamsSchema,
  CompanySchema,
  CreateCompanyParamsSchema,
  UpdateCompanyParamsSchema,
  PlaidCredentialSchema,
  CreatePlaidCredentialParamsSchema,
  UpdatePlaidCredentialParamsSchema,
  PlaidBankAccountSchema,
  CreatePlaidBankAccountParamsSchema,
  PlaidTransactionSchema,
  CreatePlaidTransactionParamsSchema,
  UpdatePlaidTransactionParamsSchema,
  QuickBooksOauthCredentialSchema,
  CreateQuickBooksOauthCredentialParamsSchema,
  UpdateQuickBooksOauthCredentialParamsSchema,
  QuickBooksOauthStateSchema,
  CreateQuickBooksOauthStateParamsSchema,
  UpdateQuickBooksOauthStateParamsSchema,
  QuickBooksJournalEntrySchema,
  CreateQuickBooksJournalEntryParamsSchema,
  UpdateQuickBooksJournalEntryParamsSchema,
  QuickBooksVendorCreditSchema,
  CreateQuickBooksVendorCreditParamsSchema,
  UpdateQuickBooksVendorCreditParamsSchema,
  QuickBooksCreditNoteSchema,
  CreateQuickBooksCreditNoteParamsSchema,
  UpdateQuickBooksCreditNoteParamsSchema,
  QuickBooksPaymentSchema,
  CreateQuickBooksPaymentParamsSchema,
  UpdateQuickBooksPaymentParamsSchema,
  QuickBooksAccountSchema,
  CreateQuickBooksAccountParamsSchema,
  UpdateQuickBooksAccountParamsSchema,
  QuickBooksTransactionSchema,
  CreateQuickBooksTransactionParamsSchema,
  UpdateQuickBooksTransactionParamsSchema,
};
