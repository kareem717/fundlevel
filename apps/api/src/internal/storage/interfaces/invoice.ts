import type {
  CreateQuickBooksInvoiceParams,
  QuickBooksInvoice,
  InvoiceLine,
  CreateInvoiceLineParams,
} from "@fundlevel/db/types";
import type {
  CursorPaginationParams,
  CursorPaginationResult
} from "@fundlevel/api/internal/entities";

type InvoiceFilterProperties = {
  minTotal?: number;
  maxTotal?: number;
  minDueDate?: string;
  maxDueDate?: string;
  companyIds?: number[];
}

// At least one property is required
export type GetManyInvoicesFilter = (Partial<InvoiceFilterProperties> & {
  [K in keyof InvoiceFilterProperties]: Record<K, InvoiceFilterProperties[K]>
}[keyof InvoiceFilterProperties]) & CursorPaginationParams<number>;

export type GetOneInvoiceFilter = { id: number } | { remoteId: string };

export interface IInvoiceRepository {
  upsert(
    invoice: CreateQuickBooksInvoiceParams[],
    companyId: number,
  ): Promise<QuickBooksInvoice[]>;
  deleteByRemoteId(remoteId: string | string[]): Promise<void>;
  getMany(filter: GetManyInvoicesFilter): Promise<CursorPaginationResult<QuickBooksInvoice, number>>;
  get(filter: GetOneInvoiceFilter): Promise<QuickBooksInvoice | undefined>;

  upsertLine(lines: CreateInvoiceLineParams[]): Promise<InvoiceLine[]>;
}
