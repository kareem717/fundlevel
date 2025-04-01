import type { IBankTransactionService } from "../interfaces/bank-transaction";
import type { IBankTransactionRepository } from "@fundlevel/api/internal/storage/interfaces";
import type { GetManyBankTransactionsFilter } from "@fundlevel/api/internal/entities";

export class BankTransactionService implements IBankTransactionService {
  constructor(private bankTransactionRepository: IBankTransactionRepository) { }

  async get(transactionId: string) {
    return await this.bankTransactionRepository.get(transactionId);
  }

  async getMany(filter: GetManyBankTransactionsFilter) {
    return await this.bankTransactionRepository.getMany(filter);
  }
} 