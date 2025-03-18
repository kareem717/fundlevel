import { createSchemaFactory } from "drizzle-zod";
import { z } from "@hono/zod-openapi"; // Extended Zod instance
import {
  accounts,
  companies,
  plaidCredentials,
  plaidBankAccounts,
  plaidTransactions,
  quickBooksOauthCredentials,
  quickBooksOauthStates,
  quickBooksInvoices,
} from "./drizzle/schema";

const { createSelectSchema, createUpdateSchema, createInsertSchema } =
  createSchemaFactory({ zodInstance: z });

// Utility functions for common field omissions
const omitTimestampFields = <T extends z.AnyZodObject>(schema: T): T =>
  schema.omit({ createdAt: true, updatedAt: true }) as T;

const omitEntityFields = <T extends z.AnyZodObject>(schema: T): T =>
  schema.omit({ id: true, createdAt: true, updatedAt: true }) as T;

const omitRelationFields = <T extends z.AnyZodObject>(
  schema: T,
  fieldNames: string[],
): T => {
  const omitObj: Record<string, true> = {};
  for (const field of fieldNames) {
    omitObj[field] = true;
  }
  return schema.omit(omitObj) as T;
};

// Account schemas
export const AccountSchema = createSelectSchema(accounts).openapi("Account");
export const CreateAccountParamsSchema = omitRelationFields(
  omitEntityFields(createInsertSchema(accounts)),
  ["userId"],
).openapi("CreateAccountParams");
export const UpdateAccountParamsSchema = omitRelationFields(
  omitEntityFields(createUpdateSchema(accounts)),
  ["userId"],
).openapi("UpdateAccountParams");

// Company schemas
export const CompanySchema = createSelectSchema(companies).openapi("Company");
export const CreateCompanyParamsSchema = omitRelationFields(
  omitEntityFields(createInsertSchema(companies)),
  ["ownerId"],
).openapi("CreateCompanyParams");
export const UpdateCompanyParamsSchema = omitRelationFields(
  omitEntityFields(createUpdateSchema(companies)),
  ["ownerId"],
).openapi("UpdateCompanyParams");

// PlaidCredential schemas
export const PlaidCredentialSchema =
  createSelectSchema(plaidCredentials).openapi("PlaidCredential");
export const CreatePlaidCredentialParamsSchema = omitRelationFields(
  omitTimestampFields(createInsertSchema(plaidCredentials)),
  ["companyId"],
).openapi("CreatePlaidCredentialParams");
export const UpdatePlaidCredentialParamsSchema = omitRelationFields(
  omitTimestampFields(createUpdateSchema(plaidCredentials)),
  ["companyId"],
).openapi("UpdatePlaidCredentialParams");

// PlaidBankAccount schemas
export const PlaidBankAccountSchema =
  createSelectSchema(plaidBankAccounts).openapi("PlaidBankAccount");
export const CreatePlaidBankAccountParamsSchema = omitRelationFields(
  omitTimestampFields(createInsertSchema(plaidBankAccounts)),
  ["companyId"],
).openapi("CreatePlaidBankAccountParams");
export const UpdatePlaidBankAccountParamsSchema = omitRelationFields(
  omitTimestampFields(createUpdateSchema(plaidBankAccounts)),
  ["companyId"],
).openapi("UpdatePlaidBankAccountParams");

// PlaidTransaction schemas
export const PlaidTransactionSchema =
  createSelectSchema(plaidTransactions).openapi("PlaidTransaction");
export const CreatePlaidTransactionParamsSchema = omitRelationFields(
  omitTimestampFields(createInsertSchema(plaidTransactions)),
  ["companyId"],
).openapi("CreatePlaidTransactionParams");
export const UpdatePlaidTransactionParamsSchema = omitRelationFields(
  omitTimestampFields(createUpdateSchema(plaidTransactions)),
  ["companyId"],
).openapi("UpdatePlaidTransactionParams");

// QuickBooksOauthCredential schemas
export const QuickBooksOauthCredentialSchema = createSelectSchema(
  quickBooksOauthCredentials,
).openapi("QuickBooksOauthCredential");
export const CreateQuickBooksOauthCredentialParamsSchema = omitRelationFields(
  omitTimestampFields(createInsertSchema(quickBooksOauthCredentials)),
  ["companyId"],
).openapi("CreateQuickBooksOauthCredentialParams");
export const UpdateQuickBooksOauthCredentialParamsSchema = omitRelationFields(
  omitTimestampFields(createUpdateSchema(quickBooksOauthCredentials)),
  ["companyId", "realmId"],
).openapi("UpdateQuickBooksOauthCredentialParams");

// QuickBooksOauthState schemas
export const QuickBooksOauthStateSchema = createSelectSchema(
  quickBooksOauthStates,
).openapi("QuickBooksOauthState");
export const CreateQuickBooksOauthStateParamsSchema = omitRelationFields(
  createInsertSchema(quickBooksOauthStates),
  ["companyId"],
).openapi("CreateQuickBooksOauthStateParams");
export const UpdateQuickBooksOauthStateParamsSchema = omitRelationFields(
  createUpdateSchema(quickBooksOauthStates),
  ["companyId"],
).openapi("UpdateQuickBooksOauthStateParams");

// QuickBooksInvoice schemas
export const QuickBooksInvoiceSchema =
  createSelectSchema(quickBooksInvoices).openapi("QuickBooksInvoice");
export const CreateQuickBooksInvoiceParamsSchema = omitRelationFields(
  omitEntityFields(createInsertSchema(quickBooksInvoices)),
  ["companyId"],
).openapi("CreateQuickBooksInvoiceParams");
export const UpdateQuickBooksInvoiceParamsSchema = omitRelationFields(
  omitEntityFields(createUpdateSchema(quickBooksInvoices)),
  ["companyId"],
).openapi("UpdateQuickBooksInvoiceParams");
