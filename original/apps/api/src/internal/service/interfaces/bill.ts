import type { OffsetPaginationResult } from "@fundlevel/api/internal/entities";
import type { Bill, BillLine } from "@fundlevel/db/types";
import type { GetManyBillsFilter } from "@fundlevel/api/internal/entities";

export interface IBillService {
  getMany(filter: GetManyBillsFilter): Promise<OffsetPaginationResult<Bill>>;
  get(billId: number): Promise<Bill>;

  getManyLines(
    filter: { billId: number } | { ids: number[] },
  ): Promise<BillLine[]>;

  reconcile(billId: number): Promise<
    {
      transactionId: number;
      confidence: "low" | "medium" | "high";
      matchReason: string;
    }[]
  >;
}
