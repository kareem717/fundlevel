import type { PlaidTransaction, PlaidBankAccount } from "@fundlevel/db/types";
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

export interface IBankingRepository {
  getManyTransactions(
    filter: GetManyTransactionsFilter,
  ): Promise<OffsetPaginationResult<PlaidTransaction>>;

  getBankAccount(bankAccountId: string): Promise<PlaidBankAccount | undefined>;
}
