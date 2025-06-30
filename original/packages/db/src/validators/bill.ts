import {
  createSelectSchema,
  createUpdateSchema,
  createInsertSchema,
} from "drizzle-zod";
import { bills, billLines } from "../schema";

// QuickBooks Invoice schemas
export const BillSchema = createSelectSchema(bills);
export const CreateBillParamsSchema = createInsertSchema(bills).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
  companyId: true,
});
export const UpdateBillParamsSchema = createUpdateSchema(bills).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
  companyId: true,
});

// Invoice Line schemas
export const BillLineSchema = createSelectSchema(billLines);
export const CreateBillLineParamsSchema = createInsertSchema(billLines).omit({
  createdAt: true,
  updatedAt: true,
  id: true,
  billId: true,
});
export const UpdateBillLineParamsSchema = createUpdateSchema(billLines).omit({
  createdAt: true,
  updatedAt: true,
  id: true,
  billId: true,
});
