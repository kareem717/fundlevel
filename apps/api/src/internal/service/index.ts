import type { Storage } from "@fundlevel/api/internal/storage";
import {
  AccountService,
  CompanyService,
  BankAccountService,
  BankTransactionService,
  InvoiceService,
  BillService,
} from "./implementations";
import type {
  IAccountService,
  ICompanyService,
  IBankAccountService,
  IBankTransactionService,
  IInvoiceService,
  IBillService,
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
  readonly bankAccount: IBankAccountService;
  readonly bankTransaction: IBankTransactionService;
  readonly invoice: IInvoiceService;
  readonly bill: IBillService;
  constructor(config: ServiceConfig) {

    const { storage, plaidConfig, qbConfig, openaiKey } = config;
    const company = new CompanyService(
      storage,
      plaidConfig,
      qbConfig,
    );
    const account = new AccountService(
      storage.account
    );

    this.account = account;
    this.company = company;
    this.bankAccount = new BankAccountService(storage.bankAccount);
    this.bankTransaction = new BankTransactionService(storage.bankTransaction);
    this.invoice = new InvoiceService(
      storage.invoice,
      storage.bankTransaction,
      openaiKey,
    );
    this.bill = new BillService(
      storage.bill,
      storage.bankTransaction,
      openaiKey,
    );
  }
}

export * from "./interfaces";
export * from "./implementations";
