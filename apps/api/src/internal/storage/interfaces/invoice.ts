import type {
  CreateQuickBooksInvoiceParams,
  QuickBooksInvoice,
  InvoiceLine,
  CreateInvoiceLineParams,
} from "@fundlevel/db/types";

export interface IInvoiceRepository {
  upsert(
    invoice: CreateQuickBooksInvoiceParams[],
    companyId: number,
  ): Promise<QuickBooksInvoice[]>;
  deleteByRemoteId(remoteId: string | string[]): Promise<void>;
  getByCompanyId(companyId: number): Promise<QuickBooksInvoice[]>;
  getByRemoteId(remoteId: string): Promise<QuickBooksInvoice | undefined>;
  getById(id: number): Promise<QuickBooksInvoice | undefined>;

  upsertLine(lines: CreateInvoiceLineParams[]): Promise<InvoiceLine[]>;
}
