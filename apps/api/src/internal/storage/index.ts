import type {
  IAccountRepository,
  ICompanyRepository,
  IInvoiceRepository,
  IBankingRepository,
} from "./interfaces";
import {
  CompanyRepository,
  AccountRepository,
  InvoiceRepository,
  BankingRepository,
} from "./implementations";
import type { DB, Transaction } from "@fundlevel/db";

export type IDB = DB | Transaction;

export class Storage {
  public readonly account: IAccountRepository;
  public readonly company: ICompanyRepository;
  public readonly invoice: IInvoiceRepository;
  public readonly banking: IBankingRepository;
  private readonly db: IDB;

  constructor(db: IDB) {
    this.db = db;

    this.account = new AccountRepository(this.db);
    this.company = new CompanyRepository(this.db);
    this.invoice = new InvoiceRepository(this.db);
    this.banking = new BankingRepository(this.db);
  }

  async runInTransaction<T>(fn: (db: IDB) => Promise<T>): Promise<T> {
    return await this.db.transaction(async (tx) => {
      return fn(tx as IDB);
    });
  }
}
