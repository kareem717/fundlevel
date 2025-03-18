import type { SupabaseClient } from "@supabase/supabase-js";
import type { Database } from "@fundlevel/supabase"
import type {
  BankAccount,
  CreateBankAccount,
  BankTransaction,
  CreateBankTransaction,
  CreateInvoice,
  Invoice,
} from "../../entities";
import type { IAccountingRepository } from "../interfaces/accounting";

export class AccountingRepository implements IAccountingRepository {
  constructor(private supabase: SupabaseClient<Database>) { }

  async upsertBankAccount(
    bankAccount: CreateBankAccount,
    companyId: number,
  ): Promise<BankAccount> {
    const { data, error } = await this.supabase
      .from("plaid_bank_accounts")
      .upsert(
        { ...bankAccount, company_id: companyId },
        {
          onConflict: "remote_id",
        },
      )
      .select("*")
      .single();

    if (error) {
      throw new Error(`Failed to create bank account: ${error.message}`);
    }

    return data;
  }

  async getBankAccountByRemoteId(id: string): Promise<BankAccount> {
    const { data, error } = await this.supabase
      .from("plaid_bank_accounts")
      .select("*")
      .eq("remote_id", id)
      .single();

    if (error) {
      throw new Error(`Failed to get bank account: ${error.message}`);
    }

    return data;
  }

  async getBankAccountsByCompanyId(companyId: number): Promise<BankAccount[]> {
    const { data, error } = await this.supabase
      .from("plaid_bank_accounts")
      .select("*")
      .eq("company_id", companyId);

    if (error) {
      throw new Error(`Failed to get bank accounts: ${error.message}`);
    }

    return data || [];
  }

  async updateBankAccount(
    remoteId: string,
    bankAccount: Partial<CreateBankAccount>,
  ): Promise<BankAccount> {
    const { data, error } = await this.supabase
      .from("plaid_bank_accounts")
      .update(bankAccount)
      .eq("remote_id", remoteId)
      .select("*")
      .single();

    if (error) {
      throw new Error(`Failed to update bank account: ${error.message}`);
    }

    return data;
  }

  async deleteBankAccount(remoteId: string): Promise<void> {
    const { error } = await this.supabase
      .from("plaid_bank_accounts")
      .delete()
      .eq("remote_id", remoteId);

    if (error) {
      throw new Error(`Failed to delete bank account: ${error.message}`);
    }
  }

  async upsertTransaction(
    transaction: CreateBankTransaction | CreateBankTransaction[],
    companyId: number,
  ) {
    const transactions = Array.isArray(transaction)
      ? transaction
      : [transaction];

    const { error } = await this.supabase.from("plaid_transactions").upsert(
      transactions.map((t) => ({ ...t, company_id: companyId })),
      {
        onConflict: "remote_id",
      },
    );

    if (error) {
      throw new Error(`Failed to create transaction: ${error.message}`);
    }
  }

  async getTransactionById(id: string): Promise<BankTransaction | undefined> {
    const { data, error } = await this.supabase
      .from("plaid_transactions")
      .select("*")
      .eq("remote_id", id)
      .single();

    if (error && error.code !== "PGRST116") {
      throw new Error(`Failed to get transaction: ${error.message}`);
    }

    return data || undefined;
  }

  async getTransactionsByBankAccountId(
    bankAccountId: string,
  ): Promise<BankTransaction[]> {
    const { data, error } = await this.supabase
      .from("plaid_transactions")
      .select("*")
      .eq("bank_account_id", bankAccountId);

    if (error) {
      throw new Error(`Failed to get transactions: ${error.message}`);
    }

    return data || [];
  }

  async deleteTransaction(
    id: string | string[],
  ): Promise<void> {
    const { error } = await this.supabase
      .from("plaid_transactions")
      .delete()
      .in("remote_id", Array.isArray(id) ? id : [id]);

    if (error) {
      throw new Error(`Failed to delete transaction: ${error.message}`);
    }
  }

  async upsertInvoice(
    invoice: CreateInvoice,
    companyId: number,
  ): Promise<Invoice> {
    const { data, error } = await this.supabase
      .from("quick_books_invoices")
      .upsert(
        { ...invoice, company_id: companyId },
        {
          onConflict: "remote_id",
        },
      )
      .select("*")
      .single();

    if (error) {
      throw new Error(`Failed to create/update invoice: ${error.message}`);
    }

    return data;
  }

  async getInvoiceById(id: number): Promise<Invoice | undefined> {
    const { data, error } = await this.supabase
      .from("quick_books_invoices")
      .select("*")
      .eq("id", id)
      .single();

    if (error && error.code !== "PGRST116") {
      throw new Error(`Failed to get invoice: ${error.message}`);
    }

    return data || undefined;
  }

  async getInvoicesByCompanyId(companyId: number): Promise<Invoice[]> {
    const { data, error } = await this.supabase
      .from("quick_books_invoices")
      .select("*")
      .eq("company_id", companyId);

    if (error) {
      throw new Error(`Failed to get invoices: ${error.message}`);
    }

    return data || [];
  }

  async deleteInvoiceByRemoteId(remoteId: string | string[]): Promise<void> {
    const { error } = await this.supabase
      .from("quick_books_invoices")
      .delete()
      .in("remote_id", Array.isArray(remoteId) ? remoteId : [remoteId]);

    if (error) {
      throw new Error(`Failed to delete invoice: ${error.message}`);
    }
  }
}
