import type { BankAccountTransaction, BankAccount, CreateBankAccountParams, CreateBankAccountTransactionParams } from "@fundlevel/db/types";
import type {
  OffsetPaginationParams,
  OffsetPaginationResult,
} from "@fundlevel/api/internal/entities";
export type GetManyTransactionsFilter = {
  minDate?: string;
  maxDate?: string;
  minAmount?: number;
  maxAmount?: number;
} & (
    | {
      companyIds: number[];
      bankAccountIds?: string[];
    }
    | {
      companyIds?: number[];
      bankAccountIds: string[];
    }
  ) &
  OffsetPaginationParams;

export type GetManyBankAccountsFilter = {
  companyIds: number[];
} & OffsetPaginationParams;

export interface IBankingRepository {

  getManyBankAccounts(
    filter: GetManyBankAccountsFilter,
  ): Promise<OffsetPaginationResult<Omit<BankAccount, "remainingRemoteContent">>>;
  getBankAccount(bankAccountId: string): Promise<Omit<BankAccount, "remainingRemoteContent"> | undefined>;
  upsertBankAccounts(
    params: CreateBankAccountParams[],
    companyId: number,
  ): Promise<void>;

  getManyTransactions(
    filter: GetManyTransactionsFilter,
  ): Promise<OffsetPaginationResult<Omit<BankAccountTransaction, "remainingRemoteContent">>>;
  upsertTransactions(
    params: CreateBankAccountTransactionParams[],
    companyId: number,
  ): Promise<void>;
  getTransaction(remoteId: string): Promise<Omit<BankAccountTransaction, "remainingRemoteContent"> | undefined>
  deleteTransactions(
    remoteIds: string[],
  ): Promise<void>;
}
