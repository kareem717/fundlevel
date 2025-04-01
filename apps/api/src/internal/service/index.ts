import type { Storage } from "@fundlevel/api/internal/storage";
import {
  AccountService,
  CompanyService,
  ReconciliationService,
  BankAccountService,
  BankTransactionService,
  InvoiceService,
} from "./implementations";
import type {
  IAccountService,
  ICompanyService,
  IReconciliationService,
  IBankAccountService,
  IBankTransactionService,
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
  readonly bankAccount: IBankAccountService;
  readonly bankTransaction: IBankTransactionService;
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
    this.bankAccount = new BankAccountService(config.storage.banking);
    this.bankTransaction = new BankTransactionService(config.storage.banking);
    this.invoice = new InvoiceService(config.storage.invoice);
  }
}

export * from "./interfaces";
export * from "./implementations";
