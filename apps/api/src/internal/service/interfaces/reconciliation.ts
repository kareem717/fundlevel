import type { BankTransaction } from "@fundlevel/db/types";

export interface IReconciliationService {
  // Reconciles an invoice by suggesting transactions that may be related to it
  reconcileInvoice(invoiceId: number): Promise<
    {
      transactionId: number;
      confidence: "low" | "medium" | "high";
      matchReason: string;
    }[]
  >;
}
