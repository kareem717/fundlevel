import type { CreateAccountParams } from "../../entities";
import type { IAccountService } from "..";
import type { IAccountRepository } from "../../storage";

export class AccountService implements IAccountService {
  constructor(private readonly accountRepo: IAccountRepository) {}

  async getByUserId(id: string) {
    return await this.accountRepo.getByUserId(id);
  }

  async create(account: CreateAccountParams) {
    return await this.accountRepo.create(account);
  }
}
