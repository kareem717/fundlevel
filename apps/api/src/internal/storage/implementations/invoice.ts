import type {
  Invoice,
  CreateInvoiceParams,
  InvoiceLine,
  CreateInvoiceLineParams,
} from "@fundlevel/db/types";
import type {
  IInvoiceRepository,
} from "../interfaces/invoice";
import { invoices, invoiceLines, bankTransactionRelationships } from "@fundlevel/db/schema";
import { eq, inArray, sql, gte, lte, asc, desc, count, and } from "drizzle-orm";
import type { IDB } from "@fundlevel/api/internal/storage";
import type { OffsetPaginationResult, GetManyInvoicesFilter } from "@fundlevel/api/internal/entities";

export class InvoiceRepository implements IInvoiceRepository {
  constructor(private db: IDB) { }

  async upsert(
    invoiceParams: CreateInvoiceParams[],
    companyId: number,
  ): Promise<Invoice[]> {
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
  ): Promise<OffsetPaginationResult<Invoice>> {
    const whereCondition = and(
      filter.minTotal ? gte(invoices.totalAmount, filter.minTotal) : undefined,
      filter.maxTotal ? lte(invoices.totalAmount, filter.maxTotal) : undefined,
      filter.companyIds ? inArray(invoices.companyId, filter.companyIds) : undefined,
      filter.minDueDate ? gte(invoices.dueDate, filter.minDueDate) : undefined,
      filter.maxDueDate ? lte(invoices.dueDate, filter.maxDueDate) : undefined,
    );


    const { page, pageSize, order } = filter;
    const qb = this.db.select().from(invoices).groupBy(invoices.id)
      .where(whereCondition)
      .limit(pageSize)
      .offset(page * pageSize)
      .orderBy(order === "asc" ? asc(invoices.id) : desc(invoices.id));

    const countQb = this.db
      .select({
        total: count(),
      })
      .from(invoices)
      .where(whereCondition);

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
      totalPages: Math.ceil(total[0]!.total / pageSize),
      totalRecords: total[0]!.total,
      hasNextPage: total[0]!.total > page * pageSize + pageSize,
      hasPreviousPage: page > 0,
      currentPage: page + 1,
    };
  }

  async get(
    filter: { id: number } | { remoteId: string },
  ): Promise<Invoice | undefined> {
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

  async delete(filter: { id: number } | { remoteId: string }): Promise<void> {
    await this.db
      .delete(invoices)
      .where(
        "id" in filter ? eq(invoices.id, filter.id) : eq(invoices.remoteId, filter.remoteId),
      );
  }

  async deleteMany(filter: { id: number[] } | { remoteId: string[] }): Promise<void> {
    await this.db.transaction(async (tx) => {


      const invoiceIds = await tx
        .delete(invoices)
        .where(
          "id" in filter ? inArray(invoices.id, filter.id) : inArray(invoices.remoteId, filter.remoteId),
        ).returning({
          id: invoices.id,
        });

      await tx.delete(bankTransactionRelationships)
        .where(
          and(
            eq(bankTransactionRelationships.entityType, "invoice"),
            inArray(bankTransactionRelationships.entityId, invoiceIds.map((invoice) => invoice.id)),
          )
        )
    });
  }

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

  async getManyLines(filter: { invoiceId: number } | { ids: number[] }): Promise<InvoiceLine[]> {
    const qb = this.db.select().from(invoiceLines);

    if ("invoiceId" in filter) {
      qb.where(eq(invoiceLines.invoiceId, filter.invoiceId));
    }

    if ("ids" in filter) {
      qb.where(inArray(invoiceLines.id, filter.ids));
    }

    return await qb;
  }
}
