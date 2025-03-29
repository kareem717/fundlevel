import {
  createSelectSchema,
  createUpdateSchema,
  createInsertSchema,
} from "drizzle-zod";
import { invoices, invoiceLines } from "../schema";

// QuickBooks Invoice schemas
const InvoiceSchema = createSelectSchema(invoices);
const CreateInvoiceParamsSchema = createInsertSchema(
  invoices,
).omit({ id: true, createdAt: true, updatedAt: true, companyId: true });
const UpdateInvoiceParamsSchema = createUpdateSchema(
  invoices,
).omit({ id: true, createdAt: true, updatedAt: true, companyId: true });

// Invoice Line schemas
const InvoiceLineSchema = createSelectSchema(invoiceLines);
const CreateInvoiceLineParamsSchema = createInsertSchema(
  invoiceLines,
).omit({ createdAt: true, updatedAt: true, id: true, invoiceId: true });
const UpdateInvoiceLineParamsSchema = createUpdateSchema(
  invoiceLines,
).omit({ createdAt: true, updatedAt: true, id: true, invoiceId: true });

export {
  InvoiceSchema,
  CreateInvoiceParamsSchema,
  UpdateInvoiceParamsSchema,
  InvoiceLineSchema,
  CreateInvoiceLineParamsSchema,
  UpdateInvoiceLineParamsSchema,
};