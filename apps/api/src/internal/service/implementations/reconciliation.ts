import type { IReconciliationService } from "../interfaces";

export class ReconciliationService implements IReconciliationService {
  constructor(
    private bankTxRepo: IBankTransactionRepository,
    private invoiceRepo: IInvoiceRepository,
    private readonly openAiKey: string,
  ) { }

 
}
