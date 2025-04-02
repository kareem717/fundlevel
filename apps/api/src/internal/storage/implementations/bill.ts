import type {
  Bill,
  CreateBillParams,
  BillLine,
  CreateBillLineParams,
} from "@fundlevel/db/types";
import type { IBillRepository } from "../interfaces";
import {
  bills,
  billLines,
  bankTransactionRelationships,
} from "@fundlevel/db/schema";
import { eq, inArray, sql, gte, lte, asc, desc, count, and } from "drizzle-orm";
import type { IDB } from "@fundlevel/api/internal/storage";
import type {
  OffsetPaginationResult,
  GetManyBillsFilter,
} from "@fundlevel/api/internal/entities";

export class BillRepository implements IBillRepository {
  constructor(private db: IDB) {}

  async upsert(
    billParams: CreateBillParams[],
    companyId: number,
  ): Promise<Bill[]> {
    if (billParams.length === 0) {
      return [];
    }

    const data = await this.db
      .insert(bills)
      .values(billParams.map((bill) => ({ ...bill, companyId })))
      .onConflictDoUpdate({
        target: [bills.remoteId],
        set: {
          remoteId: sql.raw(`excluded.${bills.remoteId.name}`),
          remainingRemoteContent: sql.raw(
            `excluded.${bills.remainingRemoteContent.name}`,
          ),
          syncToken: sql.raw(`excluded.${bills.syncToken.name}`),
          totalAmount: sql.raw(`excluded.${bills.totalAmount.name}`),
          remainingBalance: sql.raw(`excluded.${bills.remainingBalance.name}`),
          dueDate: sql.raw(`excluded.${bills.dueDate.name}`),
          currency: sql.raw(`excluded.${bills.currency.name}`),
        },
      })
      .returning();

    if (!data.length) {
      throw new Error("Failed to create/update bills");
    }

    return data;
  }

  async getMany<T extends GetManyBillsFilter>(
    filter: T,
  ): Promise<OffsetPaginationResult<Bill>> {
    const whereCondition = and(
      filter.minTotal ? gte(bills.totalAmount, filter.minTotal) : undefined,
      filter.maxTotal ? lte(bills.totalAmount, filter.maxTotal) : undefined,
      filter.companyIds
        ? inArray(bills.companyId, filter.companyIds)
        : undefined,
      filter.minDueDate ? gte(bills.dueDate, filter.minDueDate) : undefined,
      filter.maxDueDate ? lte(bills.dueDate, filter.maxDueDate) : undefined,
    );

    const { page, pageSize, order } = filter;
    const qb = this.db
      .select()
      .from(bills)
      .groupBy(bills.id)
      .where(whereCondition)
      .limit(pageSize)
      .offset(page * pageSize)
      .orderBy(order === "asc" ? asc(bills.id) : desc(bills.id));

    const countQb = this.db
      .select({
        total: count(),
      })
      .from(bills)
      .where(whereCondition);

    const [data, total] = await Promise.all([qb, countQb]);

    if (!data || !total) {
      throw new Error("Failed to get bills");
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
  ): Promise<Bill | undefined> {
    const qb = this.db.select().from(bills);

    if ("id" in filter) {
      qb.where(eq(bills.id, filter.id));
    }

    if ("remoteId" in filter) {
      qb.where(eq(bills.remoteId, filter.remoteId));
    }

    const [data] = await qb.limit(1);

    return data;
  }

  async delete(filter: { id: number } | { remoteId: string }): Promise<void> {
    await this.db
      .delete(bills)
      .where(
        "id" in filter
          ? eq(bills.id, filter.id)
          : eq(bills.remoteId, filter.remoteId),
      );
  }

  async deleteMany(
    filter: { id: number[] } | { remoteId: string[] },
  ): Promise<void> {
    await this.db.transaction(async (tx) => {
      const billIds = await tx
        .delete(bills)
        .where(
          "id" in filter
            ? inArray(bills.id, filter.id)
            : inArray(bills.remoteId, filter.remoteId),
        )
        .returning({
          id: bills.id,
        });

      await tx.delete(bankTransactionRelationships).where(
        and(
          eq(bankTransactionRelationships.entityType, "bill"),
          inArray(
            bankTransactionRelationships.entityId,
            billIds.map((bill) => bill.id),
          ),
        ),
      );
    });
  }

  async upsertLine(lines: CreateBillLineParams[]): Promise<BillLine[]> {
    return await this.db
      .insert(billLines)
      .values(lines)
      .onConflictDoUpdate({
        target: [billLines.remoteId],
        set: {
          description: sql.raw(`excluded.${billLines.description.name}`),
          amount: sql.raw(`excluded.${billLines.amount.name}`),
          remainingRemoteContent: sql.raw(
            `excluded.${billLines.remainingRemoteContent.name}`,
          ),
        },
      })
      .returning();
  }

  async getManyLines(
    filter: { billId: number } | { ids: number[] },
  ): Promise<BillLine[]> {
    const qb = this.db.select().from(billLines);

    if ("billId" in filter) {
      qb.where(eq(billLines.billId, filter.billId));
    }

    if ("ids" in filter) {
      qb.where(inArray(billLines.id, filter.ids));
    }

    return await qb;
  }
}
