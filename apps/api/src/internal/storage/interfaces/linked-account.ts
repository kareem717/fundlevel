import type { LinkedAccount, CreateLinkedAccount } from "../../entities";

export interface ILinkedAccountRepository {
  create(account: CreateLinkedAccount): Promise<LinkedAccount>;
}
