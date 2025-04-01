import type { BankTransaction } from "@fundlevel/db/types";
import type { OffsetPaginationResult } from "@fundlevel/api/internal/entities";
import type { GetManyBankTransactionsFilter } from "@fundlevel/api/internal/entities";

/**
 * Interface for Bank Transaction service to handle bank transaction operations
 */
export interface IBankTransactionService {
  /**
   * Get a single transaction by its ID
   */
  get(filter: { id: number } | { remoteId: string }): Promise<Omit<BankTransaction, "remainingRemoteContent"> | undefined>;

  /**
   * Get multiple transactions based on filter criteria
   */
  getMany(
    filter: GetManyBankTransactionsFilter,
  ): Promise<OffsetPaginationResult<Omit<BankTransaction, "remainingRemoteContent">>>;
} 