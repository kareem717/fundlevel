import type { BankAccount } from "@fundlevel/db/types";
import type { OffsetPaginationResult, GetManyBankAccountsFilter } from "@fundlevel/api/internal/entities";

/**
 * Interface for Bank Account service to handle bank account operations
 */
export interface IBankAccountService {
  /**
   * Get a single bank account by its ID
   */
  get(filter: { id: number } | { remoteId: string }): Promise<Omit<BankAccount, "remainingRemoteContent"> | undefined>;

  /**
   * Get multiple bank accounts based on filter criteria
   */
  getMany(
    filter: GetManyBankAccountsFilter,
  ): Promise<OffsetPaginationResult<Omit<BankAccount, "remainingRemoteContent">>>;

  /**
   * Get the balance of a company
   */
  getCompanyBalance(companyId: number): Promise<{
    availableBalance: number;
    currentBalance: number;
  }>;
} 