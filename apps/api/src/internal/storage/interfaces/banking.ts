import type { PlaidTransaction } from "@fundlevel/db/types";
import type {
  CursorPaginationParams,
  CursorPaginationResult,
} from "@fundlevel/api/internal/entities";

type TransactionFilterProperties = {
  minAuthorizedAt?: string;
  maxAuthorizedAt?: string;
  minAmount?: number;
  maxAmount?: number;
  bankAccountIds?: string[];
};

// At least one property is required
export type GetManyTransactionsFilter = (Partial<TransactionFilterProperties> &
  {
    [K in keyof TransactionFilterProperties]: Record<
      K,
      TransactionFilterProperties[K]
    >;
  }[keyof TransactionFilterProperties]) &
  CursorPaginationParams<string> & // Required for reconciliation
  {
    companyIds: number[];
  };

export interface IBankingRepository {
  getManyTransactions(
    filter: GetManyTransactionsFilter,
  ): Promise<CursorPaginationResult<PlaidTransaction, string>>;
}
