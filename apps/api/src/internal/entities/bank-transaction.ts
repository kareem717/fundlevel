import type { OffsetPaginationParams } from "./pagination";

export type GetManyBankTransactionsFilter = {
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
  ) & OffsetPaginationParams;

export type BankTransactionDetails = {
  totalVolume: number;
  accountedAmount: number;
  unaccountedAmount: number;
  unaccountedPercentage: number;
};
