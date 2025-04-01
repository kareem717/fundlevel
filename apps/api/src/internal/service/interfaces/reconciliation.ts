export interface IReconciliationService {
  // Reconciles an invoice by suggesting transactions that may be related to it
  reconcileInvoice(invoiceId: number): Promise<
    {
      suggestedTransactions: {
        transactionId: string;
        confidence: "low" | "medium" | "high";
        matchReason: string;
      }[];
      evaluatedTransactions: string[];
    }
  >;
}
