import {
  createSelectSchema,
  createUpdateSchema,
  createInsertSchema,
} from "drizzle-zod";
import {
  companies,
  companyPlaidCredentials,
  companyQuickBooksOauthCredentials,
  companySyncStatus,
  quickBooksOauthStates,
} from "@fundlevel/db/schema";

export const CompanySchema = createSelectSchema(companies);

export const CreateCompanyParamsSchema = createInsertSchema(companies).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
  ownerId: true,
});

export const UpdateCompanyParamsSchema = createUpdateSchema(companies).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
  ownerId: true,
});

export const PlaidCredentialSchema = createSelectSchema(
  companyPlaidCredentials,
);

export const CreatePlaidCredentialParamsSchema = createInsertSchema(
  companyPlaidCredentials,
).omit({ createdAt: true, updatedAt: true, companyId: true });

export const UpdatePlaidCredentialParamsSchema = createUpdateSchema(
  companyPlaidCredentials,
).omit({ createdAt: true, updatedAt: true, companyId: true });

export const QuickBooksOauthCredentialSchema = createSelectSchema(
  companyQuickBooksOauthCredentials,
);

export const CreateQuickBooksOauthCredentialParamsSchema = createInsertSchema(
  companyQuickBooksOauthCredentials,
).omit({ createdAt: true, updatedAt: true, companyId: true });

export const UpdateQuickBooksOauthCredentialParamsSchema = createUpdateSchema(
  companyQuickBooksOauthCredentials,
).omit({ createdAt: true, updatedAt: true, companyId: true, realmId: true });

export const QuickBooksOauthStateSchema = createSelectSchema(
  quickBooksOauthStates,
);

export const CreateQuickBooksOauthStateParamsSchema = createInsertSchema(
  quickBooksOauthStates,
).omit({ companyId: true });

export const UpdateQuickBooksOauthStateParamsSchema = createUpdateSchema(
  quickBooksOauthStates,
).omit({ companyId: true });

export const CompanySyncStatusSchema = createSelectSchema(companySyncStatus);

export const CreateCompanySyncStatusParamsSchema = createInsertSchema(
  companySyncStatus,
).omit({ companyId: true });

export const UpdateCompanySyncStatusParamsSchema = createUpdateSchema(
  companySyncStatus,
).omit({ companyId: true });
