import type { CreateAccountParams } from "@fundlevel/db/types";
import type { IAuthService } from "../interfaces/auth";
import type { IAccountRepository } from "@fundlevel/api/internal/storage/interfaces";

export class AuthService implements IAuthService {
  constructor(
    private readonly accountRepo: IAccountRepository,
  ) { }

  async createAccount(account: CreateAccountParams) {
    return await this.accountRepo.create(account);
  }

  async getAccountByUserId(userId: string) {
    return (await this.accountRepo.getByUserId(userId)) || null;
  }
}
