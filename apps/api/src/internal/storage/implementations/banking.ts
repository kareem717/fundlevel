import type { IBankingRepository } from "../interfaces";
import type { IDB } from "@fundlevel/api/internal/storage";
import type { GetManyTransactionsFilter } from "../interfaces/banking";
import type { PlaidTransaction, PlaidBankAccount } from "@fundlevel/db/types";
import type { OffsetPaginationResult } from "@fundlevel/api/internal/entities";
import { plaidTransactions, plaidBankAccounts } from "@fundlevel/db/schema";
import { inArray, gte, lte, asc, desc, count, eq } from "drizzle-orm";

export class BankingRepository implements IBankingRepository {
  constructor(private db: IDB) { }

  async getManyTransactions(
    filter: GetManyTransactionsFilter,
  ): Promise<OffsetPaginationResult<PlaidTransaction>> {
    let qb = this.db
      .select()
      .from(plaidTransactions)
      .groupBy(plaidTransactions.remoteId)
      .$dynamic();

    let countQb = this.db
      .select({
        total: count(),
      })
      .from(plaidTransactions)
      .$dynamic();

    if (filter.minAuthorizedAt) {
      qb = qb.where(
        gte(plaidTransactions.authorizedAt, filter.minAuthorizedAt),
      );
      countQb = countQb.where(
        gte(plaidTransactions.authorizedAt, filter.minAuthorizedAt),
      );
    }

    if (filter.maxAuthorizedAt) {
      qb = qb.where(
        lte(plaidTransactions.authorizedAt, filter.maxAuthorizedAt),
      );
      countQb = countQb.where(
        lte(plaidTransactions.authorizedAt, filter.maxAuthorizedAt),
      );
    }

    if (filter.minAmount) {
      qb = qb.where(gte(plaidTransactions.amount, filter.minAmount));
      countQb = countQb.where(gte(plaidTransactions.amount, filter.minAmount));
    }

    if (filter.maxAmount) {
      qb = qb.where(lte(plaidTransactions.amount, filter.maxAmount));
      countQb = countQb.where(lte(plaidTransactions.amount, filter.maxAmount));
    }

    if (filter.bankAccountIds) {
      qb = qb.where(
        inArray(plaidTransactions.bankAccountId, filter.bankAccountIds),
      );
      countQb = countQb.where(
        inArray(plaidTransactions.bankAccountId, filter.bankAccountIds),
      );
    }

    if (filter.companyIds) {
      qb = qb.where(inArray(plaidTransactions.companyId, filter.companyIds));
      countQb = countQb.where(
        inArray(plaidTransactions.companyId, filter.companyIds),
      );
    }

    const { offset, limit, order } = filter;

    qb = qb
      .limit(limit)
      .offset(offset)
      .orderBy(
        order === "asc"
          ? asc(plaidTransactions.remoteId)
          : desc(plaidTransactions.remoteId),
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
      totalPages: Math.ceil(total[0]!.total / limit),
      totalRecords: total[0]!.total,
      hasNextPage: total[0]!.total > offset + limit,
      hasPreviousPage: offset > 0,
      currentPage: Math.floor(offset / limit) + 1,
    };
  }

  async getBankAccount(bankAccountId: string) {
    const [data] = await this.db.select().from(plaidBankAccounts).where(eq(plaidBankAccounts.remoteId, bankAccountId));

    return data;
  }
}
