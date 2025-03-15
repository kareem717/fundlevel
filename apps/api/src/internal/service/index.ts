/**
 * Service layer exports
 */

import {
  AccountService,
} from "./implementations";
import {
  IAccountService,
} from "./interfaces";
import { Storage } from "../storage";

export class Service {
  public readonly account: IAccountService;

  constructor(storage: Storage) {
    this.account = new AccountService(storage.account);
  }
}

export * from "./interfaces";
export * from "./implementations";