import type { BankAccountTransaction, BankAccount } from "@fundlevel/db/types";
import type { OffsetPaginationResult } from "@fundlevel/api/internal/entities";
import type { GetManyTransactionsFilter, GetManyBankAccountsFilter } from "@fundlevel/api/internal/storage/interfaces";

/**
 * Interface for Banking service to handle bank transactions and related operations
 */
export interface IBankingService {
  /**
   * Get transactions based on filter criteria
   */
  getManyTransactions(
    filter: GetManyTransactionsFilter,
  ): Promise<OffsetPaginationResult<BankAccountTransaction>>;
  getTransaction(transactionId: string): Promise<BankAccountTransaction | undefined>;

  getBankAccount(bankAccountId: string): Promise<BankAccount | undefined>;
  getManyBankAccounts(
    filter: GetManyBankAccountsFilter,
  ): Promise<OffsetPaginationResult<BankAccount>>;


}
