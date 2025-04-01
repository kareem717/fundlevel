import type { IBankTransactionService } from "../interfaces/bank-transaction";
import type { IBankTransactionRepository } from "@fundlevel/api/internal/storage/interfaces";
import type { GetManyBankTransactionsFilter } from "@fundlevel/api/internal/entities";
import type { CreateBankTransactionRelationshipParams } from "@fundlevel/db/types";

export class BankTransactionService implements IBankTransactionService {
  constructor(private bankTransactionRepository: IBankTransactionRepository) { }

  async get(filter: { id: number } | { remoteId: string }) {
    return await this.bankTransactionRepository.get(filter);
  }

  async getMany(filter: GetManyBankTransactionsFilter) {
    return await this.bankTransactionRepository.getMany(filter);
  }

  async createRelationship(params: CreateBankTransactionRelationshipParams, bankTransactionId: number) {
    return await this.bankTransactionRepository.createRelationship(params, bankTransactionId);
  }

  async validateOwnership(bankTransactionId: number, accountId: number) {
    return await this.bankTransactionRepository.validateOwnership(bankTransactionId, accountId);
  }
} 