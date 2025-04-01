import type { OffsetPaginationParams } from "./pagination";

export type GetManyBankAccountsFilter = {
  companyIds: number[];
} & OffsetPaginationParams;
