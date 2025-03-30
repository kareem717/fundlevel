import type { CreateAccountParams } from "@fundlevel/db/types";
import type { IAccountService } from "../interfaces";
import type { IAccountRepository } from "@fundlevel/api/internal/storage/interfaces";

export class AccountService implements IAccountService {
  constructor(private readonly accountRepo: IAccountRepository) { }

  async create(account: CreateAccountParams) {
    return await this.accountRepo.create(account);
  }

  async get(filters: { id: number } | { userId: string }) {
    return await this.accountRepo.get(filters);
  }
}
