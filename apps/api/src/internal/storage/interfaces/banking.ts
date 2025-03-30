import type { BankAccountTransaction, BankAccount, CreateBankAccountParams, CreateBankAccountTransactionParams } from "@fundlevel/db/types";
import type {
  OffsetPaginationParams,
  OffsetPaginationResult,
} from "@fundlevel/api/internal/entities";
export type GetManyTransactionsFilter = {
  minAuthorizedAt?: string;
  maxAuthorizedAt?: string;
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
  getManyBankAccountTransactions(
    filter: GetManyTransactionsFilter,
  ): Promise<OffsetPaginationResult<BankAccountTransaction>>;

  getManyBankAccounts(
    filter: GetManyBankAccountsFilter,
  ): Promise<OffsetPaginationResult<BankAccount>>;
  getBankAccount(bankAccountId: string): Promise<BankAccount | undefined>;
  upsertBankAccounts(
    params: CreateBankAccountParams[],
    companyId: number,
  ): Promise<BankAccount[]>;

  upsertTransactions(
    params: CreateBankAccountTransactionParams[],
    companyId: number,
  ): Promise<void>;
  deleteTransactions(
    remoteIds: string[],
  ): Promise<void>;
}
