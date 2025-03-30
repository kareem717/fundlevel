import type { Storage } from "@fundlevel/api/internal/storage";
import {
  AccountService,
  CompanyService,
  ReconciliationService,
  BankingService,
  InvoiceService,
} from "./implementations";
import type {
  IAccountService,
  ICompanyService,
  IReconciliationService,
  IBankingService,
  IInvoiceService,
} from "./interfaces";
import type { QuickBooksConfig, PlaidConfig } from "./implementations/company";

type ServiceConfig = {
  storage: Storage;
  qbConfig: QuickBooksConfig;
  plaidConfig: PlaidConfig;
  openaiKey: string;
};

export class Service {
  readonly account: IAccountService;
  readonly company: ICompanyService;
  readonly reconciliation: IReconciliationService;
  readonly banking: IBankingService;
  readonly invoice: IInvoiceService;

  constructor(config: ServiceConfig) {
    const company = new CompanyService(
      config.storage,
      config.plaidConfig,
      config.qbConfig,
    );
    const account = new AccountService(
      config.storage.account
    );

    this.reconciliation = new ReconciliationService(
      config.storage.banking,
      config.storage.invoice,
      config.openaiKey,
    );
    this.account = account;
    this.company = company;
    this.banking = new BankingService(config.storage.banking);
    this.invoice = new InvoiceService(config.storage.invoice);
  }
}

export * from "./interfaces";
export * from "./implementations";
