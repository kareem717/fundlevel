import type { IBankAccountService } from "../interfaces/bank-account";
import type { IBankAccountRepository } from "@fundlevel/api/internal/storage/interfaces";
import type { GetManyBankAccountsFilter } from "@fundlevel/api/internal/entities";

export class BankAccountService implements IBankAccountService {
  constructor(private bankAccountRepository: IBankAccountRepository) { }

  async get(bankAccountId: string) {
    return await this.bankAccountRepository.get(bankAccountId);
  }

  async getMany(filter: GetManyBankAccountsFilter) {
    return await this.bankAccountRepository.getMany(filter);
  }
} 