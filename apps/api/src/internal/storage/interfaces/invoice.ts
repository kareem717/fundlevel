import type {
  CreateQuickBooksInvoiceParams,
  QuickBooksInvoice,
  InvoiceLine,
  CreateInvoiceLineParams,
} from "@fundlevel/db/types";
import type {
  OffsetPaginationParams,
  OffsetPaginationResult,
} from "@fundlevel/api/internal/entities";

type InvoiceFilterProperties = {
  minTotal?: number;
  maxTotal?: number;
  minDueDate?: string;
  maxDueDate?: string;
  companyIds?: number[];
};

// At least one property is required
export type GetManyInvoicesFilter = (Partial<InvoiceFilterProperties> &
  {
    [K in keyof InvoiceFilterProperties]: Record<K, InvoiceFilterProperties[K]>;
  }[keyof InvoiceFilterProperties]) &
  OffsetPaginationParams;

export interface IInvoiceRepository {
  upsert(
    invoice: CreateQuickBooksInvoiceParams[],
    companyId: number,
  ): Promise<QuickBooksInvoice[]>;
  deleteByRemoteId(remoteId: string | string[]): Promise<void>;
  getMany(
    filter: GetManyInvoicesFilter,
  ): Promise<OffsetPaginationResult<QuickBooksInvoice>>;
  get(
    filter: { id: number } | { remoteId: string },
  ): Promise<QuickBooksInvoice | undefined>;

  upsertLine(lines: CreateInvoiceLineParams[]): Promise<InvoiceLine[]>;
}
