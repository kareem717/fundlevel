import type { Bill as DBBill } from "@fundlevel/db/types";
import type { OffsetPaginationParams } from "./pagination";

export type GetManyBillsFilter = {
  minTotal?: number;
  maxTotal?: number;
  minDueDate?: string;
  maxDueDate?: string;
  companyIds: number[];
} & OffsetPaginationParams;

export type Bill = Omit<DBBill, "remainingRemoteContent">;