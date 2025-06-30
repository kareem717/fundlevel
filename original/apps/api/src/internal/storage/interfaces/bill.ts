import type {
  CreateBillParams,
  Bill,
  BillLine,
  CreateBillLineParams,
} from "@fundlevel/db/types";
import type {
  GetManyBillsFilter,
  OffsetPaginationResult,
} from "@fundlevel/api/internal/entities";

export interface IBillRepository {
  upsert(bill: CreateBillParams[], companyId: number): Promise<Bill[]>;
  delete(filter: { id: number } | { remoteId: string }): Promise<void>;
  deleteMany(filter: { id: number[] } | { remoteId: string[] }): Promise<void>;

  getMany(filter: GetManyBillsFilter): Promise<OffsetPaginationResult<Bill>>;
  get(filter: { id: number } | { remoteId: string }): Promise<Bill | undefined>;
  getManyLines(
    filter: { billId: number } | { ids: number[] },
  ): Promise<BillLine[]>;
  upsertLine(lines: CreateBillLineParams[]): Promise<BillLine[]>;
}
