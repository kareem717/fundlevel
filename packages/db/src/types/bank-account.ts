import type { InferInsertModel, InferSelectModel } from "drizzle-orm";
import type { bankAccounts } from "../schema/bank-account";
import type { OmitTimeStampFields } from "./utils";

export type BankAccount = InferSelectModel<typeof bankAccounts>;

export type CreateBankAccountParams = Omit<
  OmitTimeStampFields<InferInsertModel<typeof bankAccounts>>,
  "companyId"
>;

export type UpdateBankAccountParams = Partial<CreateBankAccountParams>; 