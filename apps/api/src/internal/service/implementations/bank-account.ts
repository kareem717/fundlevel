import type { IBankAccountService } from "../interfaces/bank-account";
import type { IBankAccountRepository } from "@fundlevel/api/internal/storage/interfaces";
import type { GetManyBankAccountsFilter } from "@fundlevel/api/internal/entities";

export class BankAccountService implements IBankAccountService {
  constructor(private bankAccountRepository: IBankAccountRepository) { }

  async get(filter: { id: number } | { remoteId: string }) {
    return await this.bankAccountRepository.get(filter);
  }

  async getMany(filter: GetManyBankAccountsFilter) {
    return await this.bankAccountRepository.getMany(filter);
  }

  async getCompanyBalance(companyId: number) {
    return await this.bankAccountRepository.getCompanyBalance(companyId);
  }
} 