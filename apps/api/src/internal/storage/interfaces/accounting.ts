import type { BankAccount, CreateBankAccount, CreateBankTransaction, UpdateBankAccount, BankTransaction } from "../../entities";

export interface IAccountingRepository {
  upsertBankAccount(params: CreateBankAccount, companyId: number): Promise<BankAccount>;
  getBankAccountById(id: number): Promise<BankAccount | undefined>;
  getBankAccountsByCompanyId(companyId: number): Promise<BankAccount[]>;
  deleteBankAccount(id: number): Promise<void>;

  upsertTransaction(params: CreateBankTransaction | CreateBankTransaction[], companyId: number): Promise<void>;
  getTransactionById(id: number): Promise<BankTransaction | undefined>;
  getTransactionsByCompanyId(companyId: number): Promise<BankTransaction[]>;
  deleteTransactionByRemoteId(remoteId: string | string[]): Promise<void>;
} 