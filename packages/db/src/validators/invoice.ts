import {
  createSelectSchema,
  createUpdateSchema,
  createInsertSchema,
} from "drizzle-zod";
import { invoices, invoiceLines } from "../schema";

// QuickBooks Invoice schemas
export const InvoiceSchema = createSelectSchema(invoices);
export const CreateInvoiceParamsSchema = createInsertSchema(invoices).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
  companyId: true,
});
export const UpdateInvoiceParamsSchema = createUpdateSchema(invoices).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
  companyId: true,
});

// Invoice Line schemas
export const InvoiceLineSchema = createSelectSchema(invoiceLines);
export const CreateInvoiceLineParamsSchema = createInsertSchema(invoiceLines).omit({
  createdAt: true,
  updatedAt: true,
  id: true,
  invoiceId: true,
});
export const UpdateInvoiceLineParamsSchema = createUpdateSchema(invoiceLines).omit({
  createdAt: true,
  updatedAt: true,
  id: true,
  invoiceId: true,
});
