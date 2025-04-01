import type { BankAccount, CreateBankAccountParams } from "@fundlevel/db/types";
import type {
  OffsetPaginationResult,
  GetManyBankAccountsFilter,
} from "@fundlevel/api/internal/entities";

export interface IBankAccountRepository {
  /**
   * Get multiple bank accounts with pagination
   */
  getMany(
    filter: GetManyBankAccountsFilter,
  ): Promise<OffsetPaginationResult<Omit<BankAccount, "remainingRemoteContent">>>;

  /**
   * Get a single bank account by its ID
   */
  get(bankAccountId: string): Promise<Omit<BankAccount, "remainingRemoteContent"> | null>;

  /**
   * Create or update multiple bank accounts for a company
   */
  upsertMany(
    params: CreateBankAccountParams[],
    companyId: number,
  ): Promise<void>;
} 