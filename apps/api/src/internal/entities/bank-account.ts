import type { OffsetPaginationParams } from "./pagination";

export type GetManyBankAccountsFilter = {
  companyIds: number[];
  sortBy: "transactions" | "id";
} & OffsetPaginationParams;
