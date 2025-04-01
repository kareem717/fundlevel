import type { IInvoiceRepository } from "@fundlevel/api/internal/storage/interfaces";
import type { GetManyInvoicesFilter } from "@fundlevel/api/internal/entities";
import type { Invoice } from "@fundlevel/db/types";
import type { OffsetPaginationResult } from "@fundlevel/api/internal/entities";
import type { IInvoiceService } from "../interfaces";

export class InvoiceService implements IInvoiceService {
  constructor(private readonly repo: IInvoiceRepository) { }

  async getMany(filter: GetManyInvoicesFilter): Promise<OffsetPaginationResult<Invoice>> {
    return this.repo.getMany(filter);
  }

  async get(invoiceId: number): Promise<Invoice> {
    const invoice = await this.repo.get({ id: invoiceId });
    if (!invoice) {
      throw new Error("Invoice not found");
    }

    return invoice;
  }

  async getManyLines(filter: { invoiceId: number } | { ids: number[] }) {
    return this.repo.getManyLines(filter);
  }
} 