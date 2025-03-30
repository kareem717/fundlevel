import type { IBankingService } from "../interfaces/banking";
import type { IBankingRepository } from "@fundlevel/api/internal/storage/interfaces";
import type { GetManyTransactionsFilter, GetManyBankAccountsFilter } from "@fundlevel/api/internal/storage/interfaces";

export class BankingService implements IBankingService {
  constructor(private bankingRepository: IBankingRepository) {}

  async getManyBankAccountTransactions(filter: GetManyTransactionsFilter) {
    return await this.bankingRepository.getManyBankAccountTransactions(filter);
  }

  async getBankAccount(bankAccountId: string) {
    return await this.bankingRepository.getBankAccount(bankAccountId);
  }

  async getManyBankAccounts(filter: GetManyBankAccountsFilter) {
    return await this.bankingRepository.getManyBankAccounts(filter);
  }
}
