import type {
  QuickBooksInvoice,
  CreateQuickBooksInvoiceParams,
  InvoiceLine,
  CreateInvoiceLineParams,
} from "@fundlevel/db/types";
import type { GetManyInvoicesFilter, GetOneInvoiceFilter, IInvoiceRepository } from "../interfaces/invoice";
import { invoices, invoiceLines } from "@fundlevel/db/schema";
import { eq, inArray, sql, gte, lte, asc, desc } from "drizzle-orm";
import type { IDB } from "@fundlevel/api/internal/storage";
import type { CursorPaginationResult } from "@fundlevel/api/internal/entities";

export class InvoiceRepository implements IInvoiceRepository {
  constructor(private db: IDB) { }

  async upsert(
    invoiceParams: CreateQuickBooksInvoiceParams[],
    companyId: number,
  ): Promise<QuickBooksInvoice[]> {
    if (invoiceParams.length === 0) {
      return [];
    }

    const data = await this.db
      .insert(invoices)
      .values(invoiceParams.map((invoice) => ({ ...invoice, companyId })))
      .onConflictDoUpdate({
        target: [invoices.remoteId],
        set: {
          remoteId: sql.raw(`excluded.${invoices.remoteId.name}`),
          remainingRemoteContent: sql.raw(
            `excluded.${invoices.remainingRemoteContent.name}`,
          ),
          syncToken: sql.raw(`excluded.${invoices.syncToken.name}`),
          totalAmount: sql.raw(
            `excluded.${invoices.totalAmount.name}`,
          ),
          depositMade: sql.raw(
            `excluded.${invoices.depositMade.name}`,
          ),
          balanceRemaining: sql.raw(
            `excluded.${invoices.balanceRemaining.name}`,
          ),
          dueDate: sql.raw(`excluded.${invoices.dueDate.name}`),
          depositToAccountReferenceValue: sql.raw(
            `excluded.${invoices.depositToAccountReferenceValue.name}`,
          ),
          currency: sql.raw(`excluded.${invoices.currency.name}`),
        },
      })
      .returning();

    if (!data.length) {
      throw new Error("Failed to create/update invoices");
    }

    return data;
  }

  async getMany(filter: GetManyInvoicesFilter): Promise<CursorPaginationResult<QuickBooksInvoice, number>> {
    let qb = this.db
      .select()
      .from(invoices).$dynamic();

    if (filter.minTotal) {
      qb = qb.where(gte(invoices.totalAmount, filter.minTotal));
    }

    if (filter.maxTotal) {
      qb = qb.where(lte(invoices.totalAmount, filter.maxTotal));
    }

    if (filter.minDueDate) {
      qb = qb.where(gte(invoices.dueDate, filter.minDueDate));
    }

    if (filter.maxDueDate) {
      qb = qb.where(lte(invoices.dueDate, filter.maxDueDate));
    }

    if (filter.companyIds) {
      qb = qb.where(inArray(invoices.companyId, filter.companyIds));
    }

    if (filter.cursor) {
      switch (filter.order) {
        case "asc":
          qb = qb.where(gte(invoices.id, filter.cursor));
          break;
        case "desc":
          qb = qb.where(lte(invoices.id, filter.cursor));
          break;
      }
    }

    const data = await qb
      .limit(filter.limit + 1)
      .orderBy(filter.order === "asc" ? asc(invoices.id) : desc(invoices.id));

    if (!data) {
      throw new Error("Failed to get invoices");
    }

    let nextCursor: number | null = null;
    if (data.length > filter.limit) {
      nextCursor = (data.pop())!.id;
    }

    return {
      data,
      nextCursor,
    }
  };

  async get(filter: GetOneInvoiceFilter): Promise<QuickBooksInvoice | undefined> {
    const qb = this.db
      .select()
      .from(invoices)

    if ("id" in filter) {
      qb.where(eq(invoices.id, filter.id));
    }

    if ("remoteId" in filter) {
      qb.where(eq(invoices.remoteId, filter.remoteId));
    }

    const [data] = await qb
      .limit(1);

    return data;
  };

  // async getByCompanyId(companyId: number): Promise<QuickBooksInvoice[]> {
  //   const data = await this.db
  //     .select()
  //     .from(invoices)
  //     .where(eq(invoices.companyId, companyId));

  //   return data;
  // }

  async deleteByRemoteId(remoteId: string | string[]): Promise<void> {
    await this.db
      .delete(invoices)
      .where(
        inArray(
          invoices.remoteId,
          Array.isArray(remoteId) ? remoteId : [remoteId],
        ),
      );
  }

  // async getByRemoteId(
  //   remoteId: string,
  // ): Promise<QuickBooksInvoice | undefined> {
  //   const [data] = await this.db
  //     .select()
  //     .from(invoices)
  //     .where(eq(invoices.remoteId, remoteId))
  //     .limit(1);

  //   return data;
  // }

  // async getById(id: number): Promise<QuickBooksInvoice | undefined> {
  //   const [data] = await this.db
  //     .select()
  //     .from(invoices)
  //     .where(eq(invoices.id, id))
  //     .limit(1);

  //   return data;
  // }

  async upsertLine(lines: CreateInvoiceLineParams[]): Promise<InvoiceLine[]> {
    return await this.db
      .insert(invoiceLines)
      .values(lines)
      .onConflictDoUpdate({
        target: [
          invoiceLines.remoteId,
          invoiceLines.invoiceId,
          invoiceLines.detailType,
        ],
        set: {
          details: sql.raw(`excluded.${invoiceLines.details.name}`),
          description: sql.raw(`excluded.${invoiceLines.description.name}`),
          amount: sql.raw(`excluded.${invoiceLines.amount.name}`),
          detailType: sql.raw(`excluded.${invoiceLines.detailType.name}`),
          lineNumber: sql.raw(`excluded.${invoiceLines.lineNumber.name}`),
        },
      })
      .returning();
  }
}
