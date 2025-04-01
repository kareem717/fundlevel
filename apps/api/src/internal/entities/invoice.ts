import type { OffsetPaginationParams } from "./pagination";
import type { Invoice as DBInvoice } from "@fundlevel/db/types";

export type GetManyInvoicesFilter = {
  minTotal?: number;
  maxTotal?: number;
  minDueDate?: string;
  maxDueDate?: string;
  companyIds: number[];
} & OffsetPaginationParams;

export type Invoice = Omit<DBInvoice, "remainingRemoteContent">;