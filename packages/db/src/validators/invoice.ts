import {
  createSelectSchema,
  createUpdateSchema,
  createInsertSchema,
} from "drizzle-zod";
import { quickBooksInvoices, invoiceLines } from "../schema";

// QuickBooks Invoice schemas
export const QuickBooksInvoiceSchema = createSelectSchema(quickBooksInvoices);
export const CreateQuickBooksInvoiceParamsSchema = createInsertSchema(
  quickBooksInvoices,
).omit({ id: true, createdAt: true, updatedAt: true, companyId: true });
export const UpdateQuickBooksInvoiceParamsSchema = createUpdateSchema(
  quickBooksInvoices,
).omit({ id: true, createdAt: true, updatedAt: true, companyId: true });

// Invoice Line schemas
export const InvoiceLineSchema = createSelectSchema(invoiceLines);
export const CreateInvoiceLineParamsSchema = createInsertSchema(
  invoiceLines,
).omit({ createdAt: true, updatedAt: true, id: true, invoiceId: true });
export const UpdateInvoiceLineParamsSchema = createUpdateSchema(
  invoiceLines,
).omit({ createdAt: true, updatedAt: true, id: true, invoiceId: true });
