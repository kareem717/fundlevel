import type { BankTransaction, CreateBankTransactionParams } from "@fundlevel/db/types";
import type {
  OffsetPaginationResult,
  GetManyBankTransactionsFilter
} from "@fundlevel/api/internal/entities";


export interface IBankTransactionRepository {
  /**
   * Get multiple bank transactions with pagination and filtering
   */
  getMany(
    filter: GetManyBankTransactionsFilter,
  ): Promise<OffsetPaginationResult<Omit<BankTransaction, "remainingRemoteContent">>>;

  /**
   * Get a single transaction by its remote ID
   */
  get(
    filter: {
      id: number;
    } | {
      remoteId: string;
    }
  ): Promise<Omit<BankTransaction, "remainingRemoteContent"> | undefined>;

  /**
   * Create or update multiple transactions for a company
   */
  upsertMany(
    params: CreateBankTransactionParams[],
    companyId: number,
  ): Promise<void>;

  /**
   * Delete multiple transactions by their remote IDs
   */
  deleteMany(
    remoteIds: string[],
  ): Promise<void>;
} 