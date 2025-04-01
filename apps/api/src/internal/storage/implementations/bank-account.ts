import type { IBankAccountRepository } from "../interfaces/bank-account";
import type { CreateBankAccountParams } from "@fundlevel/db/types";
import { bankAccounts } from "@fundlevel/db/schema";
import { inArray, asc, desc, count, eq, sql, and, getTableColumns, sum } from "drizzle-orm";
import type { GetManyBankAccountsFilter } from "@fundlevel/api/internal/entities";
import type { IDB } from "../index";
import { bankTransactions } from "@fundlevel/db/schema";
export class BankAccountRepository implements IBankAccountRepository {
  constructor(private db: IDB) { }

  async getMany(filter: GetManyBankAccountsFilter) {
    const { page, pageSize, order } = filter;

    const whereCondition = and(
      filter.companyIds ? inArray(bankAccounts.companyId, filter.companyIds) : undefined
    );

    const { remainingRemoteContent, ...ba } = getTableColumns(bankAccounts)
    let qb = this.db.select(ba).from(bankAccounts)
      .groupBy(bankAccounts.id).where(whereCondition).limit(pageSize).offset(page * pageSize).$dynamic();

    switch (filter.sortBy) {
      case "transactions":
        qb = qb.leftJoin(bankTransactions, eq(bankTransactions.bankAccountRemoteId, bankAccounts.remoteId))
          .groupBy(bankAccounts.id)
          .orderBy(
            filter.order === "asc" ? asc(count(bankTransactions.id)) : desc(count(bankTransactions.id))
          );
        break;
      case "id":
        qb = qb.orderBy(
          filter.order === "asc" ? asc(bankAccounts.id) : desc(bankAccounts.id)
        );
        break;
    }

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

  async get(filter: { id: number } | { remoteId: string }) {
    const { remainingRemoteContent, ...ba } = getTableColumns(bankAccounts)

    const [data] = await this.db.select(ba).from(bankAccounts).where(
      "id" in filter ? eq(bankAccounts.id, filter.id) : eq(bankAccounts.remoteId, filter.remoteId)
    );

    return data;
  }

  async upsertMany(
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

  async getCompanyBalance(companyId: number) {
    const [data] = await this.db.select({
      availableBalance: sum(bankAccounts.availableBalance),
      currentBalance: sum(bankAccounts.currentBalance),
    }).from(bankAccounts).where(eq(bankAccounts.companyId, companyId));


    return {
      availableBalance: Number.parseFloat(data?.availableBalance || "0"),
      currentBalance: Number.parseFloat(data?.currentBalance || "0"),
    };
  }
} 