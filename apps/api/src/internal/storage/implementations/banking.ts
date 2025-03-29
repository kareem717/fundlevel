import type { IBankingRepository } from "../interfaces";
import type { IDB } from "@fundlevel/api/internal/storage";
import type { GetManyTransactionsFilter } from "../interfaces/banking";
import type { PlaidTransaction } from "@fundlevel/db/types";
import type { CursorPaginationResult } from "@fundlevel/api/internal/entities";
import { plaidTransactions } from "@fundlevel/db/schema";
import { eq, inArray, gte, lte, asc, desc } from "drizzle-orm";

export class BankingRepository implements IBankingRepository {
  constructor(private db: IDB) {}

  async getManyTransactions(
    filter: GetManyTransactionsFilter,
  ): Promise<CursorPaginationResult<PlaidTransaction, string>> {
    let qb = this.db
      .select()
      .from(plaidTransactions)
      .where(inArray(plaidTransactions.companyId, filter.companyIds))
      .$dynamic();

    if (filter.minAuthorizedAt) {
      qb = qb.where(
        gte(plaidTransactions.authorizedAt, filter.minAuthorizedAt),
      );
    }

    if (filter.maxAuthorizedAt) {
      qb = qb.where(
        lte(plaidTransactions.authorizedAt, filter.maxAuthorizedAt),
      );
    }

    if (filter.minAmount) {
      qb = qb.where(gte(plaidTransactions.amount, filter.minAmount));
    }

    if (filter.maxAmount) {
      qb = qb.where(lte(plaidTransactions.amount, filter.maxAmount));
    }

    if (filter.bankAccountIds) {
      qb = qb.where(
        inArray(plaidTransactions.bankAccountId, filter.bankAccountIds),
      );
    }

    // Handle cursor pagination
    if (filter.cursor) {
      switch (filter.order) {
        case "asc":
          qb = qb.where(gte(plaidTransactions.remoteId, filter.cursor));
          break;
        case "desc":
          qb = qb.where(lte(plaidTransactions.remoteId, filter.cursor));
          break;
      }
    }

    // Fetch one extra record to determine if there's a next page
    const data = await qb
      .limit(filter.limit + 1)
      .orderBy(
        filter.order === "asc"
          ? asc(plaidTransactions.remoteId)
          : desc(plaidTransactions.remoteId),
      );

    if (!data) {
      throw new Error("Failed to get transactions");
    }

    let nextCursor: string | null = null;
    if (data.length > filter.limit) {
      nextCursor = data.pop()!.remoteId;
    }

    return {
      data,
      nextCursor,
    };
  }
}
