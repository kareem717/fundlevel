import type { LinkedAccount } from "../../entities";

export interface ILinkedAccountService {
  createLinkToken({
    accountId,
    organizationName
  }: {
    accountId: number;
    organizationName: string;
  }): Promise<string>;

  swapPublicToken({
    accountId,
    publicToken
  }: {
    accountId: number;
    publicToken: string;
  }): Promise<LinkedAccount>;
}
