import type { IBankTransactionRepository } from "../interfaces/bank-transaction";
import type { GetManyBankTransactionsFilter } from "@fundlevel/api/internal/entities";
import type { CreateBankTransactionParams, CreateBankTransactionRelationshipParams } from "@fundlevel/db/types";
import { bankTransactions, bankAccounts, bankTransactionRelationships, companies } from "@fundlevel/db/schema";
import { inArray, gte, lte, asc, desc, count, eq, sql, and, getTableColumns } from "drizzle-orm";
import type { IDB } from "../index";

export class BankTransactionRepository implements IBankTransactionRepository {
  constructor(private db: IDB) { }

  async getMany(
    filter: GetManyBankTransactionsFilter,
  ) {
    const whereCondition = and(
      filter.minDate ? gte(bankTransactions.date, filter.minDate) : undefined,
      filter.maxDate ? lte(bankTransactions.date, filter.maxDate) : undefined,
      filter.minAmount !== undefined ? gte(bankTransactions.amount, filter.minAmount) : undefined,
      filter.maxAmount !== undefined ? lte(bankTransactions.amount, filter.maxAmount) : undefined,
      filter.companyIds ? inArray(bankTransactions.companyId, filter.companyIds) : undefined
    );

    let countQb = this.db
      .select({
        total: count(),
      })
      .from(bankTransactions)
      .where(whereCondition)
      .$dynamic();

    const { page, pageSize, order } = filter;
    const { remainingRemoteContent, ...bat } = getTableColumns(bankTransactions);
    let qb = this.db
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
      ).$dynamic();

    if (filter.bankAccountIds) {
      qb = qb.innerJoin(bankAccounts, and(
        eq(bankTransactions.bankAccountRemoteId, bankAccounts.remoteId),
        inArray(bankAccounts.id, filter.bankAccountIds)
      ));

      countQb = countQb.innerJoin(bankAccounts, and(
        eq(bankTransactions.bankAccountRemoteId, bankAccounts.remoteId),
        inArray(bankAccounts.id, filter.bankAccountIds)
      ));
    }

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

  async get(filter: { id: number } | { remoteId: string }) {
    const { remainingRemoteContent, ...tx } = getTableColumns(bankTransactions)
    const [data] = await this.db.select(tx).from(bankTransactions).where(
      "id" in filter ? eq(bankTransactions.id, filter.id) : eq(bankTransactions.remoteId, filter.remoteId)
    );
    return data;
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

  async createRelationship(params: CreateBankTransactionRelationshipParams, bankTransactionId: number) {
    await this.db.insert(bankTransactionRelationships).values({ ...params, bankTransactionId });
  }

  async validateOwnership(bankTransactionId: number, accountId: number) {
    const [data] = await this.db.select({
      ownerId: companies.ownerId,
    }).from(bankTransactions)
      .innerJoin(companies, eq(bankTransactions.companyId, companies.id))
      .where(eq(bankTransactions.id, bankTransactionId));

    return data?.ownerId === accountId;
  }
}   