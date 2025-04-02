import type { bills, billLines } from "@fundlevel/db/schema";
import type { InferSelectModel, InferInsertModel } from "drizzle-orm";
import type { OmitEntityFields } from "./utils";

// QuickBooks Invoice types
export type Bill = InferSelectModel<typeof bills>;
export type CreateBillParams = Omit<OmitEntityFields<Bill>, "companyId">;
export type UpdateBillParams = Partial<CreateBillParams>;

// Invoice Line types
export type BillLine = InferSelectModel<typeof billLines>;
export type CreateBillLineParams = OmitEntityFields<
  InferInsertModel<typeof billLines>
>;
export type UpdateBillLineParams = Partial<
  Omit<CreateBillLineParams, "id" | "billId">
>;
