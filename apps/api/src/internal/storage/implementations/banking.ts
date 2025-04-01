import type { IBankingRepository } from "../interfaces";
import type { DB } from "@fundlevel/db";
import type { GetManyTransactionsFilter, GetManyBankAccountsFilter } from "../interfaces/banking";
import type { BankAccountTransaction, CreateBankAccountParams, CreateBankAccountTransactionParams } from "@fundlevel/db/types";
import { bankAccountTransactions, bankAccounts } from "@fundlevel/db/schema";
import { inArray, gte, lte, asc, desc, count, eq, sql, and, getTableColumns } from "drizzle-orm";

export class BankingRepository implements IBankingRepository {
  constructor(private db: DB) { }

  async getManyTransactions(
    filter: GetManyTransactionsFilter,
  ) {
    const whereCondition = and(
      filter.minDate ? gte(bankAccountTransactions.date, filter.minDate) : undefined,
      filter.maxDate ? lte(bankAccountTransactions.date, filter.maxDate) : undefined,
      filter.minAmount !== undefined ? gte(bankAccountTransactions.amount, filter.minAmount) : undefined,
      filter.maxAmount !== undefined ? lte(bankAccountTransactions.amount, filter.maxAmount) : undefined,
      filter.bankAccountIds ? inArray(bankAccountTransactions.bankAccountId, filter.bankAccountIds) : undefined,
      filter.companyIds ? inArray(bankAccountTransactions.companyId, filter.companyIds) : undefined
    );

    const countQb = this.db
      .select({
        total: count(),
      })
      .from(bankAccountTransactions)
      .where(whereCondition);

    const { page, pageSize, order } = filter;
    const { remainingRemoteContent, ...bat } = getTableColumns(bankAccountTransactions);
    const qb = this.db
      .select(bat)
      .from(bankAccountTransactions)
      .where(whereCondition)
      .groupBy(bankAccountTransactions.remoteId)
      .limit(pageSize)
      .offset(page * pageSize)
      .orderBy(
        order === "asc"
          ? asc(bankAccountTransactions.remoteId)
          : desc(bankAccountTransactions.remoteId),
      );

    // ... rest of the function remains the same
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
  async getBankAccount(bankAccountId: string) {
    const [data] = await this.db.select().from(bankAccounts).where(eq(bankAccounts.remoteId, bankAccountId));

    return data;
  }

  async getManyBankAccounts(filter: GetManyBankAccountsFilter) {
    const { page, pageSize, order } = filter;

    const whereCondition = and(
      filter.companyIds ? inArray(bankAccounts.companyId, filter.companyIds) : undefined
    );

    const { remainingRemoteContent, ...ba } = getTableColumns(bankAccounts)
    const qb = this.db.select(ba).from(bankAccounts)
      .groupBy(bankAccounts.remoteId).where(whereCondition).limit(pageSize).offset(page * pageSize).orderBy(order === "asc" ? asc(bankAccounts.remoteId) : desc(bankAccounts.remoteId));

    const countQb = this.db.select({
      total: count(),
    }).from(bankAccounts).where(whereCondition);

    const [data, total] = await Promise.all([qb, countQb]);

    if (!data || !total) {
      throw new Error("Failed to get bank accounts");
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

  async upsertBankAccounts(
    params: CreateBankAccountParams[],
    companyId: number,
  ) {
    if (params.length === 0) {
      return;
    }

    await this.db
      .insert(bankAccounts)
      .values(
        params.map((bankAccount) => ({ ...bankAccount, companyId })),
      )
      .onConflictDoUpdate({
        target: [bankAccounts.remoteId],
        set: {
          remoteId: sql.raw(`excluded.${bankAccounts.remoteId.name}`),
          name: sql.raw(`excluded.${bankAccounts.name.name}`),
          type: sql.raw(`excluded.${bankAccounts.type.name}`),
          subtype: sql.raw(`excluded.${bankAccounts.subtype.name}`),
          mask: sql.raw(`excluded.${bankAccounts.mask.name}`),
          currentBalance: sql.raw(
            `excluded.${bankAccounts.currentBalance.name}`,
          ),
          availableBalance: sql.raw(
            `excluded.${bankAccounts.availableBalance.name}`,
          ),
          isoCurrencyCode: sql.raw(
            `excluded.${bankAccounts.isoCurrencyCode.name}`,
          ),
          unofficialCurrencyCode: sql.raw(
            `excluded.${bankAccounts.unofficialCurrencyCode.name}`,
          ),
          officialName: sql.raw(
            `excluded.${bankAccounts.officialName.name}`,
          ),
          remainingRemoteContent: sql.raw(
            `excluded.${bankAccounts.remainingRemoteContent.name}`,
          )
        },
      })
  }

  async upsertTransactions(
    params: CreateBankAccountTransactionParams[],
    companyId: number,
  ): Promise<void> {
    if (params.length === 0) {
      return;
    }

    await this.db
      .insert(bankAccountTransactions)
      .values(params.map((t) => ({ ...t, companyId })))
      .onConflictDoUpdate({
        target: [bankAccountTransactions.remoteId],
        set: {
          remoteId: sql.raw(`excluded.${bankAccountTransactions.remoteId.name}`),
          amount: sql.raw(`excluded.${bankAccountTransactions.amount.name}`),
          authorizedAt: sql.raw(`excluded.${bankAccountTransactions.authorizedAt.name}`),
          isoCurrencyCode: sql.raw(`excluded.${bankAccountTransactions.isoCurrencyCode.name}`),
          unofficialCurrencyCode: sql.raw(`excluded.${bankAccountTransactions.unofficialCurrencyCode.name}`),
          checkNumber: sql.raw(`excluded.${bankAccountTransactions.checkNumber.name}`),
          date: sql.raw(`excluded.${bankAccountTransactions.date.name}`),
          datetime: sql.raw(`excluded.${bankAccountTransactions.datetime.name}`),
          name: sql.raw(`excluded.${bankAccountTransactions.name.name}`),
          merchantName: sql.raw(`excluded.${bankAccountTransactions.merchantName.name}`),
          originalDescription: sql.raw(`excluded.${bankAccountTransactions.originalDescription.name}`),
          pending: sql.raw(`excluded.${bankAccountTransactions.pending.name}`),
          website: sql.raw(`excluded.${bankAccountTransactions.website.name}`),
          paymentChannel: sql.raw(`excluded.${bankAccountTransactions.paymentChannel.name}`),
          personalFinanceCategoryPrimary: sql.raw(`excluded.${bankAccountTransactions.personalFinanceCategoryPrimary.name}`),
          personalFinanceCategoryDetailed: sql.raw(`excluded.${bankAccountTransactions.personalFinanceCategoryDetailed.name}`),
          personalFinanceCategoryConfidenceLevel: sql.raw(`excluded.${bankAccountTransactions.personalFinanceCategoryConfidenceLevel.name}`),
          code: sql.raw(`excluded.${bankAccountTransactions.code.name}`),
          remainingRemoteContent: sql.raw(`excluded.${bankAccountTransactions.remainingRemoteContent.name}`),
        },
      });
  }

  async deleteTransactions(remoteIds: string[]) {
    await this.db.delete(bankAccountTransactions).where(inArray(bankAccountTransactions.remoteId, remoteIds));
  }

  async getTransaction(remoteId: string) {
    const { remainingRemoteContent, ...tx } = getTableColumns(bankAccountTransactions)
    const [data] = await this.db.select(tx).from(bankAccountTransactions).where(eq(bankAccountTransactions.remoteId, remoteId));
    return data;
  }

}

