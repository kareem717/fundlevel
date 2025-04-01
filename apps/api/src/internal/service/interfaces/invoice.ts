import type { OffsetPaginationResult } from "@fundlevel/api/internal/entities";
import type { Invoice, InvoiceLine } from "@fundlevel/db/types";
import type { GetManyInvoicesFilter } from "@fundlevel/api/internal/entities";

export interface IInvoiceService {
  getMany(filter: GetManyInvoicesFilter): Promise<OffsetPaginationResult<Invoice>>;
  get(invoiceId: number): Promise<Invoice>;

  getManyLines(filter: { invoiceId: number } | { ids: number[] }): Promise<InvoiceLine[]>;
}
