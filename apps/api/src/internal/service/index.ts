import type { Storage } from "../storage";
import {
  AccountService,
  CompanyService,
  AIService,
  AccountingService,
} from "./implementations";
import type {
  IAccountService,
  ICompanyService,
  IAIService,
  IAccountingService,
} from "./interfaces";

export class Service {
  readonly account: IAccountService;
  readonly company: ICompanyService;
  readonly ai: IAIService;
  readonly accounting: IAccountingService;

  constructor(storage: Storage) {
    const company = new CompanyService(storage.company, storage.accounting);
    const accounting = new AccountingService(storage.accounting, company);

    this.account = new AccountService(storage.account);
    this.company = company;
    this.accounting = accounting;
    this.ai = new AIService(accounting);
  }
}

export * from "./interfaces";
export * from "./implementations";
