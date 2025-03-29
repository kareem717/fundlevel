import type {
  QuickBooksInvoice,
  CreateQuickBooksInvoiceParams,
  InvoiceLine,
  CreateInvoiceLineParams,
} from "@fundlevel/db/types";
import type {
  GetManyInvoicesFilter,
  IInvoiceRepository,
} from "../interfaces/invoice";
import { invoices, invoiceLines } from "@fundlevel/db/schema";
import { eq, inArray, sql, gte, lte, asc, desc, count } from "drizzle-orm";
import type { IDB } from "@fundlevel/api/internal/storage";
import type { OffsetPaginationResult } from "@fundlevel/api/internal/entities";

export class InvoiceRepository implements IInvoiceRepository {
  constructor(private db: IDB) {}

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
          totalAmount: sql.raw(`excluded.${invoices.totalAmount.name}`),
          balanceRemaining: sql.raw(
            `excluded.${invoices.balanceRemaining.name}`,
          ),
          dueDate: sql.raw(`excluded.${invoices.dueDate.name}`),
          currency: sql.raw(`excluded.${invoices.currency.name}`),
        },
      })
      .returning();

    if (!data.length) {
      throw new Error("Failed to create/update invoices");
    }

    return data;
  }

  async getMany<T extends GetManyInvoicesFilter>(
    filter: T,
  ): Promise<OffsetPaginationResult<QuickBooksInvoice>> {
    let qb = this.db.select().from(invoices).groupBy(invoices.id).$dynamic();

    let countQb = this.db
      .select({
        total: count(),
      })
      .from(invoices)
      .$dynamic();

    if (filter.minTotal) {
      qb = qb.where(gte(invoices.totalAmount, filter.minTotal));
      countQb = countQb.where(gte(invoices.totalAmount, filter.minTotal));
    }

    if (filter.maxTotal) {
      qb = qb.where(lte(invoices.totalAmount, filter.maxTotal));
      countQb = countQb.where(lte(invoices.totalAmount, filter.maxTotal));
    }

    if (filter.minDueDate) {
      qb = qb.where(gte(invoices.dueDate, filter.minDueDate));
      countQb = countQb.where(gte(invoices.dueDate, filter.minDueDate));
    }

    if (filter.maxDueDate) {
      qb = qb.where(lte(invoices.dueDate, filter.maxDueDate));
      countQb = countQb.where(lte(invoices.dueDate, filter.maxDueDate));
    }

    if (filter.companyIds) {
      qb = qb.where(inArray(invoices.companyId, filter.companyIds));
      countQb = countQb.where(inArray(invoices.companyId, filter.companyIds));
    }

    const { offset, limit, order } = filter;

    qb = qb
      .limit(limit)
      .offset(offset)
      .orderBy(order === "asc" ? asc(invoices.id) : desc(invoices.id));

    const [data, total] = await Promise.all([qb, countQb]);

    if (!data || !total) {
      throw new Error("Failed to get invoices");
    }

    if (data.length === 0) {
      return {
        data: [],
        totalPages: 0,
        totalRecords: 0,
        hasNextPage: false,
        hasPreviousPage: false,
        currentPage: 0,
      };
    }

    return {
      data: data,
      totalPages: Math.ceil(total[0]!.total / limit),
      totalRecords: total[0]!.total,
      hasNextPage: total[0]!.total > offset + limit,
      hasPreviousPage: offset > 0,
      currentPage: Math.floor(offset / limit) + 1,
    };
  }

  async get(
    filter: { id: number } | { remoteId: string },
  ): Promise<QuickBooksInvoice | undefined> {
    const qb = this.db.select().from(invoices);

    if ("id" in filter) {
      qb.where(eq(invoices.id, filter.id));
    }

    if ("remoteId" in filter) {
      qb.where(eq(invoices.remoteId, filter.remoteId));
    }

    const [data] = await qb.limit(1);

    return data;
  }

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
