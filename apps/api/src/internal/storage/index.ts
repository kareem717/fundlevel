import type {
  IAccountRepository,
  ICompanyRepository,
  IInvoiceRepository,
  IBankAccountRepository,
  IBankTransactionRepository,
  IBillRepository
} from "./interfaces";
import {
  CompanyRepository,
  AccountRepository,
  InvoiceRepository,
  BankAccountRepository,
  BankTransactionRepository,
  BillRepository
} from "./implementations";
import type { DB, Transaction } from "@fundlevel/db";

export type IDB = DB | Transaction;

export class Storage {
  public readonly account: IAccountRepository;
  public readonly company: ICompanyRepository;
  public readonly invoice: IInvoiceRepository;
  public readonly bankAccount: IBankAccountRepository;
  public readonly bankTransaction: IBankTransactionRepository;
  public readonly bill: IBillRepository;
  private readonly db: IDB;

  constructor(db: IDB) {
    this.db = db;

    this.account = new AccountRepository(this.db);
    this.company = new CompanyRepository(this.db);
    this.invoice = new InvoiceRepository(this.db);
    this.bankAccount = new BankAccountRepository(this.db);
    this.bankTransaction = new BankTransactionRepository(this.db);
    this.bill = new BillRepository(this.db);
  }

  async runInTransaction<T>(fn: (db: IDB) => Promise<T>): Promise<T> {
    return await this.db.transaction(async (tx: Transaction) => {
      return fn(tx as IDB);
    });
  }
}
