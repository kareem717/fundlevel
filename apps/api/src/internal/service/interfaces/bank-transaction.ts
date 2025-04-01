import type { BankTransaction } from "@fundlevel/db/types";
import type { OffsetPaginationResult } from "@fundlevel/api/internal/entities";
import type { GetManyTransactionsFilter } from "@fundlevel/api/internal/storage/interfaces";

/**
 * Interface for Bank Transaction service to handle bank transaction operations
 */
export interface IBankTransactionService {
  /**
   * Get a single transaction by its ID
   */
  get(transactionId: string): Promise<BankTransaction | null>;

  /**
   * Get multiple transactions based on filter criteria
   */
  getMany(
    filter: GetManyTransactionsFilter,
  ): Promise<OffsetPaginationResult<BankTransaction>>;
} 