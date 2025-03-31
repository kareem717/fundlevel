import type {
  CreateInvoiceParams,
  Invoice,
  InvoiceLine,
  CreateInvoiceLineParams,
} from "@fundlevel/db/types";
import type {
  OffsetPaginationParams,
  OffsetPaginationResult,
} from "@fundlevel/api/internal/entities";

export type GetManyInvoicesFilter = {
  minTotal?: number;
  maxTotal?: number;
  minDueDate?: string;
  maxDueDate?: string;
  companyIds: number[];
} & OffsetPaginationParams;

export interface IInvoiceRepository {
  upsert(
    invoice: CreateInvoiceParams[],
    companyId: number,
  ): Promise<Invoice[]>;
  deleteByRemoteId(remoteId: string | string[]): Promise<void>;
  getMany(
    filter: GetManyInvoicesFilter,
  ): Promise<OffsetPaginationResult<Invoice>>;
  get(
    filter: { id: number } | { remoteId: string },
  ): Promise<Invoice | undefined>;
  getManyLines(filter: { invoiceId: number } | { ids: number[] }): Promise<InvoiceLine[]>;
  upsertLine(lines: CreateInvoiceLineParams[]): Promise<InvoiceLine[]>;
}
