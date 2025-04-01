import type { BankAccount } from "@fundlevel/db/types";
import type { OffsetPaginationResult, GetManyBankAccountsFilter } from "@fundlevel/api/internal/entities";

/**
 * Interface for Bank Account service to handle bank account operations
 */
export interface IBankAccountService {
  /**
   * Get a single bank account by its ID
   */
  get(bankAccountId: string): Promise<BankAccount | undefined>;

  /**
   * Get multiple bank accounts based on filter criteria
   */
  getMany(
    filter: GetManyBankAccountsFilter,
  ): Promise<OffsetPaginationResult<BankAccount>>;
} 