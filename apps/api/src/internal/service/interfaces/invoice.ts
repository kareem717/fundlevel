import type { OffsetPaginationResult } from "@fundlevel/api/internal/entities";
import type { Invoice } from "@fundlevel/db/types";
import type { GetManyInvoicesFilter } from "@fundlevel/api/internal/storage/interfaces";


export interface IInvoiceService {
  getMany(filter: GetManyInvoicesFilter): Promise<OffsetPaginationResult<Invoice>>;
  get(invoiceId: number): Promise<Invoice>;
}
