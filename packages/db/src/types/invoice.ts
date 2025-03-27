import type {
  quickBooksInvoices,
  invoiceLines,
  invoiceLineTypes,
} from "../schema";
import type { InferSelectModel, InferInsertModel } from "drizzle-orm";
import type { OmitEntityFields } from "./utils";

// QuickBooks Invoice types
export type QuickBooksInvoice = InferSelectModel<typeof quickBooksInvoices>;
export type CreateQuickBooksInvoiceParams = Omit<
  OmitEntityFields<InferInsertModel<typeof quickBooksInvoices>>,
  "companyId"
>;
export type UpdateQuickBooksInvoiceParams =
  Partial<CreateQuickBooksInvoiceParams>;

// Invoice Line types
export type InvoiceLine = InferSelectModel<typeof invoiceLines>;
export type CreateInvoiceLineParams = OmitEntityFields<
  InferInsertModel<typeof invoiceLines>
>;
export type UpdateInvoiceLineParams = Partial<
  Omit<CreateInvoiceLineParams, "id" | "invoiceId">
>;

export type InvoiceLineType = (typeof invoiceLineTypes.enumValues)[number];
