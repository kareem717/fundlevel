import type { PlaidTransaction, PlaidBankAccount } from "@fundlevel/db/types";
import type { OffsetPaginationResult } from "@fundlevel/api/internal/entities";
import type { GetManyTransactionsFilter } from "@fundlevel/api/internal/storage/interfaces";

/**
 * Interface for Banking service to handle bank transactions and related operations
 */
export interface IBankingService {
  /**
   * Get transactions based on filter criteria
   */
  getManyTransactions(
    filter: GetManyTransactionsFilter,
  ): Promise<OffsetPaginationResult<PlaidTransaction>>;

  getBankAccount(bankAccountId: string): Promise<PlaidBankAccount | undefined>;
}
