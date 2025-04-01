import type { OffsetPaginationParams } from "./pagination";
import type { BankTransactionRelationshipType } from "@fundlevel/db/types";
export type GetManyBankTransactionsFilter = {
  minDate?: string;
  maxDate?: string;
  minAmount?: number;
  maxAmount?: number;
} & (
    {
      companyIds?: number[];
      bankAccountIds?: number[];
      relationships?: {
        type: BankTransactionRelationshipType;
        ids: number[];
      }[];
    } & (
      | { companyIds: number[] }
      | { bankAccountIds: number[] }
      | { relationships: {
        type: BankTransactionRelationshipType;
        ids: number[];
      }[] }
    )
  ) & OffsetPaginationParams;

export type BankTransactionDetails = {
  totalVolume: number;
  accountedAmount: number;
  unaccountedAmount: number;
  unaccountedPercentage: number;
};
