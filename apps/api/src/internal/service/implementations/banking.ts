import type { IBankingService } from "../interfaces/banking";
import type { IBankingRepository } from "@fundlevel/api/internal/storage/interfaces";
import type { GetManyTransactionsFilter, GetManyBankAccountsFilter } from "@fundlevel/api/internal/storage/interfaces";

export class BankingService implements IBankingService {
  constructor(private bankingRepository: IBankingRepository) { }

  async getManyTransactions(filter: GetManyTransactionsFilter) {
    return await this.bankingRepository.getManyTransactions(filter);
  }

  async getBankAccount(bankAccountId: string) {
    return await this.bankingRepository.getBankAccount(bankAccountId);
  }

  async getManyBankAccounts(filter: GetManyBankAccountsFilter) {
    return await this.bankingRepository.getManyBankAccounts(filter);
  }

  async getTransaction(transactionId: string) {
    return await this.bankingRepository.getTransaction(transactionId);
  }
}
