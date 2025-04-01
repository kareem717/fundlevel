import type { BankTransaction, CreateBankTransactionRelationshipParams } from "@fundlevel/db/types";
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

  /**
   * Create a relationship between a bank transaction and an invoice
   */
  createRelationship(params: CreateBankTransactionRelationshipParams, bankTransactionId: number): Promise<void>;

  /**
   * Validate ownership of a bank transaction
   */
  validateOwnership(bankTransactionId: number, accountId: number): Promise<boolean>;
} 