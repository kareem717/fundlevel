import type {
  QuickBooksInvoice,
  CreateQuickBooksInvoiceParams,
  InvoiceLine,
  CreateInvoiceLineParams,
} from "@fundlevel/db/types";
import type { IInvoiceRepository } from "../interfaces/invoice";
import { quickBooksInvoices, invoiceLines } from "@fundlevel/db/schema";
import { eq, inArray, sql } from "drizzle-orm";
import type { IDB } from "@fundlevel/api/internal/storage";

export class InvoiceRepository implements IInvoiceRepository {
  constructor(private db: IDB) {}

  async upsert(
    invoices: CreateQuickBooksInvoiceParams[],
    companyId: number,
  ): Promise<QuickBooksInvoice[]> {
    if (invoices.length === 0) {
      return [];
    }

    const data = await this.db
      .insert(quickBooksInvoices)
      .values(invoices.map((invoice) => ({ ...invoice, companyId })))
      .onConflictDoUpdate({
        target: [quickBooksInvoices.remoteId],
        set: {
          remoteId: sql.raw(`excluded.${quickBooksInvoices.remoteId.name}`),
          remainingRemoteContent: sql.raw(
            `excluded.${quickBooksInvoices.remainingRemoteContent.name}`,
          ),
          syncToken: sql.raw(`excluded.${quickBooksInvoices.syncToken.name}`),
          totalAmount: sql.raw(
            `excluded.${quickBooksInvoices.totalAmount.name}`,
          ),
          depositMade: sql.raw(
            `excluded.${quickBooksInvoices.depositMade.name}`,
          ),
          balanceRemaining: sql.raw(
            `excluded.${quickBooksInvoices.balanceRemaining.name}`,
          ),
          dueDate: sql.raw(`excluded.${quickBooksInvoices.dueDate.name}`),
          depositToAccountReferenceValue: sql.raw(
            `excluded.${quickBooksInvoices.depositToAccountReferenceValue.name}`,
          ),
          currency: sql.raw(`excluded.${quickBooksInvoices.currency.name}`),
        },
      })
      .returning();

    if (!data.length) {
      throw new Error("Failed to create/update invoices");
    }

    return data;
  }

  async getByCompanyId(companyId: number): Promise<QuickBooksInvoice[]> {
    const data = await this.db
      .select()
      .from(quickBooksInvoices)
      .where(eq(quickBooksInvoices.companyId, companyId));

    return data;
  }

  async deleteByRemoteId(remoteId: string | string[]): Promise<void> {
    await this.db
      .delete(quickBooksInvoices)
      .where(
        inArray(
          quickBooksInvoices.remoteId,
          Array.isArray(remoteId) ? remoteId : [remoteId],
        ),
      );
  }

  async getByRemoteId(
    remoteId: string,
  ): Promise<QuickBooksInvoice | undefined> {
    const [data] = await this.db
      .select()
      .from(quickBooksInvoices)
      .where(eq(quickBooksInvoices.remoteId, remoteId))
      .limit(1);

    return data;
  }

  async getById(id: number): Promise<QuickBooksInvoice | undefined> {
    const [data] = await this.db
      .select()
      .from(quickBooksInvoices)
      .where(eq(quickBooksInvoices.id, id))
      .limit(1);

    return data;
  }

  async upsertLine(lines: CreateInvoiceLineParams[]): Promise<InvoiceLine[]> {
    return await this.db
      .insert(invoiceLines)
      .values(lines)
      .onConflictDoUpdate({
        target: [
          invoiceLines.remoteId,
          invoiceLines.invoiceId,
          invoiceLines.detailType,
        ],
        set: {
          details: sql.raw(`excluded.${invoiceLines.details.name}`),
          description: sql.raw(`excluded.${invoiceLines.description.name}`),
          amount: sql.raw(`excluded.${invoiceLines.amount.name}`),
          detailType: sql.raw(`excluded.${invoiceLines.detailType.name}`),
          lineNumber: sql.raw(`excluded.${invoiceLines.lineNumber.name}`),
        },
      })
      .returning();
  }
}
