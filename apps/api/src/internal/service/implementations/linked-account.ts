import { Merge, MergeClient } from "@mergeapi/merge-node-client";
import type { ILinkedAccountService } from "../interfaces";
import type {
  IAccountRepository,
  ILinkedAccountRepository,
} from "../../storage";

export class LinkedAccountService implements ILinkedAccountService {
  private merge;
  private accounRepo;
  private linkedAccountRepo;

  constructor(
    mergeApiKey: string,
    accounRepo: IAccountRepository,
    linkedAccountRepo: ILinkedAccountRepository,
  ) {
    //TODO: set environment to production
    this.merge = new MergeClient({
      apiKey: mergeApiKey,
    });
    this.accounRepo = accounRepo;
    this.linkedAccountRepo = linkedAccountRepo;
  }

  async createLinkToken({
    accountId,
    organizationName,
  }: {
    accountId: number;
    organizationName: string;
  }) {
    const account = await this.accounRepo.getById(accountId);

    if (!account) {
      throw new Error("Account not found");
    }

    const token = await this.merge.accounting.linkToken.create({
      endUserEmailAddress: account.email,
      endUserOrganizationName: organizationName,
      endUserOriginId: String(account.id),
      categories: [Merge.accounting.CategoriesEnum.Accounting],
      linkExpiryMins: 30,
    });

    return token.linkToken;
  }

  async swapPublicToken({
    accountId,
    publicToken,
  }: {
    accountId: number;
    publicToken: string;
  }) {
    const token =
      await this.merge.accounting.accountToken.retrieve(publicToken);

    const account = await this.merge.accounting.linkedAccounts.list(
      {
        endUserOriginId: String(accountId),
        status: "COMPLETE",
      },
      {
        accountToken: token.accountToken,
      },
    );

    if (account.results?.length !== 1) {
      throw new Error(`Invalid account quantity: ${account.results?.length}`);
    }

    return await this.linkedAccountRepo.create({
      owner_id: accountId,
      merge_dev_account_token: token.accountToken,
      name: account.results[0].endUserOrganizationName,
    });
  }

  async getById(id: number) {
    return this.linkedAccountRepo.getById(id);
  }

  async getByAccountId(accountId: number) {
    return this.linkedAccountRepo.getByAccountId(accountId);
  }
}
