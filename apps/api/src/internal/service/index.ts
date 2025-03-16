/**
 * Service layer exports
 */

import {
  AccountService,
  LinkedAccountService,
} from "./implementations";
import type {
  ILinkedAccountService,
  IAccountService,
} from "./interfaces";
import type { Storage } from "../storage";

export class Service {
  public readonly account: IAccountService;
  public readonly linkedAccount: ILinkedAccountService;

  constructor(storage: Storage) {
    this.account = new AccountService(storage.account);
    this.linkedAccount = new LinkedAccountService(storage.linkedAccount);
  }
}

export * from "./interfaces";
export * from "./implementations";
