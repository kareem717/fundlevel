import type {
  PlaidTransaction as BankTransaction,
  PlaidBankAccount as BankAccount,
  QuickBooksInvoice as Invoice,
  QuickBooksTransaction,
  QuickBooksAccount,
  QuickBooksVendorCredit,
  QuickBooksPayment,
  QuickBooksCreditNote,
  QuickBooksJournalEntry,
} from "@fundlevel/db/types";

/**
 * Report header information
 */
export interface ReportHeader {
  reportName: string;
  time: {
    startDate: string;
    endDate: string;
  };
}

/**
 * Balance sheet report structure
 */
export interface BalanceSheetReport {
  header: ReportHeader;
  accounts: Array<{
    name: string;
    id: string;
    amount: number;
    type: string;
    subAccounts?: Array<{
      name: string;
      id: string;
      amount: number;
    }>;
  }>;
  totalAssets: number;
  totalLiabilities: number;
  equity: number;
}

/**
 * Profit and loss report structure
 */
export interface ProfitLossReport {
  header: ReportHeader;
  income: Array<{
    name: string;
    id: string;
    amount: number;
    subCategories?: Array<{
      name: string;
      id: string;
      amount: number;
    }>;
  }>;
  expenses: Array<{
    name: string;
    id: string;
    amount: number;
    subCategories?: Array<{
      name: string;
      id: string;
      amount: number;
    }>;
  }>;
  totalIncome: number;
  totalExpenses: number;
  netIncome: number;
}

/**
 * Cash flow report structure
 */
export interface CashFlowReport {
  header: ReportHeader;
  operatingActivities: Array<{
    name: string;
    id: string;
    amount: number;
  }>;
  investingActivities: Array<{
    name: string;
    id: string;
    amount: number;
  }>;
  financingActivities: Array<{
    name: string;
    id: string;
    amount: number;
  }>;
  netCashFlow: number;
  beginningCashBalance: number;
  endingCashBalance: number;
}

/**
 * Interface for Accounting service to fetch financial data needed for reconciliation
 */
export interface IAccountingService {
  /**
   * Fetch bank accounts for a company
   */
  getBankAccountsForCompany(companyId: number): Promise<BankAccount[]>;

  getTransactionsByBankAccountId(
    bankAccountId: string,
  ): Promise<BankTransaction[]>;

  /**
   * Fetch bank account details
   */
  getBankAccountDetails(remoteId: string): Promise<BankAccount>;

  /**
   * Fetch invoices for a company
   */
  getInvoicesForCompany(companyId: number): Promise<Invoice[]>;

  /**
   * Fetch the balance sheet report from QuickBooks
   */
  getBalanceSheet(
    companyId: number,
    params: { start_date: string; end_date: string },
  ): Promise<BalanceSheetReport>;

  /**
   * Fetch the profit and loss report from QuickBooks
   */
  getProfitLoss(
    companyId: number,
    params: { start_date: string; end_date: string },
  ): Promise<ProfitLossReport>;

  /**
   * Fetch the cash flow report from QuickBooks
   */
  getCashFlow(
    companyId: number,
    params: { start_date: string; end_date: string },
  ): Promise<CashFlowReport>;

  getInvoice(invoiceId: number): Promise<Invoice>;
  getInvoicesByCompanyId(companyId: number): Promise<Invoice[]>;

  getAccountingAccountsByCompanyId(
    companyId: number,
  ): Promise<QuickBooksAccount[]>;
  getAccountingAccount(id: number): Promise<QuickBooksAccount>;

  getAccountingTransactionsByCompanyId(
    companyId: number,
  ): Promise<QuickBooksTransaction[]>;
  getAccountingTransaction(id: number): Promise<QuickBooksTransaction>;

  getInvoicesByCompanyId(companyId: number): Promise<Invoice[]>;
  getInvoice(id: number): Promise<Invoice>;

  getJournalEntriesByCompanyId(
    companyId: number,
  ): Promise<QuickBooksJournalEntry[]>;
  getJournalEntry(id: number): Promise<QuickBooksJournalEntry>;

  getVendorCreditsByCompanyId(
    companyId: number,
  ): Promise<QuickBooksVendorCredit[]>;
  getVendorCredit(id: number): Promise<QuickBooksVendorCredit>;

  getCreditNotesByCompanyId(companyId: number): Promise<QuickBooksCreditNote[]>;
  getCreditNote(id: number): Promise<QuickBooksCreditNote>;

  getPaymentsByCompanyId(companyId: number): Promise<QuickBooksPayment[]>;
  getPayment(id: number): Promise<QuickBooksPayment>;
}
