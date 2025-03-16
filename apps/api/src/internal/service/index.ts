/**
 * Service layer exports
 */

import {
  AccountService,
  Companieservice,
} from "./implementations";
import type {
  ICompanieservice,
  IAccountService,
} from "./interfaces";
import type { Storage } from "../storage";

export class Service {
  public readonly account: IAccountService;
  public readonly company: ICompanieservice;

  constructor(storage: Storage) {
    this.account = new AccountService(storage.account);
    this.company = new Companieservice(storage.company);
  }
}

export * from "./interfaces";
export * from "./implementations";
