import { CreateAccount } from "../../../internal/entities";
import { IAccountService } from "../../../internal/service";
import { IAccountRepository } from "../../../internal/storage";

export class AccountService implements IAccountService {
  constructor(private readonly accountRepo: IAccountRepository) { }

  async getByUserId(id: string) {
    return await this.accountRepo.getByUserId(id);
  }

  async create(account: CreateAccount) {
    return await this.accountRepo.create(account);
  }
}
