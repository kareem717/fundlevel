import {
  AccountService,
  CompanyService,
} from "./implementations";
import type {
  ICompanyService,
  IAccountService,
} from "./interfaces";
import type { Storage } from "../storage";

export class Service {
  public readonly account: IAccountService;
  public readonly company: ICompanyService;

  constructor(storage: Storage) {
    this.account = new AccountService(storage.account);
    this.company = new CompanyService(storage.company, storage.accounting);
  }
}

export * from "./interfaces";
export * from "./implementations";
