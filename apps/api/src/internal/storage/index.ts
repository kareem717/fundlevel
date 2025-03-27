import type {
  IAccountRepository,
  ICompanyRepository,
  IAccountingRepository,
  IInvoiceRepository,
} from "./interfaces";
import {
  CompanyRepository,
  AccountRepository,
  AccountingRepository,
  InvoiceRepository,
} from "./implementations";
import type { DB, Transaction } from "@fundlevel/db";

export type IDB = DB | Transaction;

export class Storage {
  public readonly account: IAccountRepository;
  public readonly company: ICompanyRepository;
  public readonly accounting: IAccountingRepository;
  public readonly invoice: IInvoiceRepository;
  private readonly db: IDB;

  constructor(db: IDB) {
    this.db = db;

    this.account = new AccountRepository(this.db);
    this.company = new CompanyRepository(this.db);
    this.accounting = new AccountingRepository(this.db);
    this.invoice = new InvoiceRepository(this.db);
  }

  async runInTransaction<T>(fn: (db: IDB) => Promise<T>): Promise<T> {
    return await this.db.transaction(async (tx) => {
      return fn(tx as IDB);
    });
  }
}
