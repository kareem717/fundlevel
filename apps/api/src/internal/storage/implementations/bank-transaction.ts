import type { IBankTransactionRepository } from "../interfaces/bank-transaction";
import type { DB } from "@fundlevel/db";
import type { GetManyTransactionsFilter } from "../interfaces/bank-transaction";
import type { CreateBankTransactionParams } from "@fundlevel/db/types";
import { bankTransactions } from "@fundlevel/db/schema";
import { inArray, gte, lte, asc, desc, count, eq, sql, and, getTableColumns } from "drizzle-orm";

export class BankTransactionRepository implements IBankTransactionRepository {
  constructor(private db: DB) { }

  async getMany(
    filter: GetManyTransactionsFilter,
  ) {
    const whereCondition = and(
      filter.minDate ? gte(bankTransactions.date, filter.minDate) : undefined,
      filter.maxDate ? lte(bankTransactions.date, filter.maxDate) : undefined,
      filter.minAmount !== undefined ? gte(bankTransactions.amount, filter.minAmount) : undefined,
      filter.maxAmount !== undefined ? lte(bankTransactions.amount, filter.maxAmount) : undefined,
      filter.bankAccountIds ? inArray(bankTransactions.bankAccountId, filter.bankAccountIds) : undefined,
      filter.companyIds ? inArray(bankTransactions.companyId, filter.companyIds) : undefined
    );

    const countQb = this.db
      .select({
        total: count(),
      })
      .from(bankTransactions)
      .where(whereCondition);

    const { page, pageSize, order } = filter;
    const { remainingRemoteContent, ...bat } = getTableColumns(bankTransactions);
    const qb = this.db
      .select(bat)
      .from(bankTransactions)
      .where(whereCondition)
      .groupBy(bankTransactions.remoteId)
      .limit(pageSize)
      .offset(page * pageSize)
      .orderBy(
        order === "asc"
          ? asc(bankTransactions.remoteId)
          : desc(bankTransactions.remoteId),
      );

    const [data, total] = await Promise.all([qb, countQb]);

    if (!data || !total) {
      throw new Error("Failed to get transactions");
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
      data,
      totalPages: Math.ceil(total[0]!.total / pageSize),
      totalRecords: total[0]!.total,
      hasNextPage: total[0]!.total > page * pageSize + pageSize,
      hasPreviousPage: page > 0,
      currentPage: page + 1,
    };
  }

  async get(remoteId: string) {
    const { remainingRemoteContent, ...tx } = getTableColumns(bankTransactions)
    const [data] = await this.db.select(tx).from(bankTransactions).where(eq(bankTransactions.remoteId, remoteId));
    return data || null;
  }

  async upsertMany(
    params: CreateBankTransactionParams[],
    companyId: number,
  ): Promise<void> {
    if (params.length === 0) {
      return;
    }

    await this.db
      .insert(bankTransactions)
      .values(params.map((t) => ({ ...t, companyId })))
      .onConflictDoUpdate({
        target: [bankTransactions.remoteId],
        set: {
          remoteId: sql.raw(`excluded.${bankTransactions.remoteId.name}`),
          amount: sql.raw(`excluded.${bankTransactions.amount.name}`),
          authorizedAt: sql.raw(`excluded.${bankTransactions.authorizedAt.name}`),
          isoCurrencyCode: sql.raw(`excluded.${bankTransactions.isoCurrencyCode.name}`),
          unofficialCurrencyCode: sql.raw(`excluded.${bankTransactions.unofficialCurrencyCode.name}`),
          checkNumber: sql.raw(`excluded.${bankTransactions.checkNumber.name}`),
          date: sql.raw(`excluded.${bankTransactions.date.name}`),
          datetime: sql.raw(`excluded.${bankTransactions.datetime.name}`),
          name: sql.raw(`excluded.${bankTransactions.name.name}`),
          merchantName: sql.raw(`excluded.${bankTransactions.merchantName.name}`),
          originalDescription: sql.raw(`excluded.${bankTransactions.originalDescription.name}`),
          pending: sql.raw(`excluded.${bankTransactions.pending.name}`),
          website: sql.raw(`excluded.${bankTransactions.website.name}`),
          paymentChannel: sql.raw(`excluded.${bankTransactions.paymentChannel.name}`),
          personalFinanceCategoryPrimary: sql.raw(`excluded.${bankTransactions.personalFinanceCategoryPrimary.name}`),
          personalFinanceCategoryDetailed: sql.raw(`excluded.${bankTransactions.personalFinanceCategoryDetailed.name}`),
          personalFinanceCategoryConfidenceLevel: sql.raw(`excluded.${bankTransactions.personalFinanceCategoryConfidenceLevel.name}`),
          code: sql.raw(`excluded.${bankTransactions.code.name}`),
          remainingRemoteContent: sql.raw(`excluded.${bankTransactions.remainingRemoteContent.name}`),
        },
      });
  }

  async deleteMany(remoteIds: string[]) {
    await this.db.delete(bankTransactions).where(inArray(bankTransactions.remoteId, remoteIds));
  }
} 