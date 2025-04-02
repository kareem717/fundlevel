import type {
  CreateInvoiceParams,
  Invoice,
  InvoiceLine,
  CreateInvoiceLineParams,
} from "@fundlevel/db/types";
import type {
  GetManyInvoicesFilter,
  OffsetPaginationResult,
} from "@fundlevel/api/internal/entities";

export interface IInvoiceRepository {
  upsert(invoice: CreateInvoiceParams[], companyId: number): Promise<Invoice[]>;
  delete(filter: { id: number } | { remoteId: string }): Promise<void>;
  deleteMany(filter: { id: number[] } | { remoteId: string[] }): Promise<void>;

  getMany(
    filter: GetManyInvoicesFilter,
  ): Promise<OffsetPaginationResult<Invoice>>;
  get(
    filter: { id: number } | { remoteId: string },
  ): Promise<Invoice | undefined>;
  getManyLines(
    filter: { invoiceId: number } | { ids: number[] },
  ): Promise<InvoiceLine[]>;
  upsertLine(lines: CreateInvoiceLineParams[]): Promise<InvoiceLine[]>;
}
