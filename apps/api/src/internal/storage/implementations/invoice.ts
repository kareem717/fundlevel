import type {
  QuickBooksInvoice,
  CreateQuickBooksInvoiceParams,
  InvoiceLine,
  CreateInvoiceLineParams,
} from "@fundlevel/db/types";
import type { IInvoiceRepository } from "../interfaces/invoice";
import { invoices, invoiceLines } from "@fundlevel/db/schema";
import { eq, inArray, sql } from "drizzle-orm";
import type { IDB } from "@fundlevel/api/internal/storage";

export class InvoiceRepository implements IInvoiceRepository {
  constructor(private db: IDB) { }

  async upsert(
    invoiceParams: CreateQuickBooksInvoiceParams[],
    companyId: number,
  ): Promise<QuickBooksInvoice[]> {
    if (invoiceParams.length === 0) {
      return [];
    }

    const data = await this.db
      .insert(invoices)
      .values(invoiceParams.map((invoice) => ({ ...invoice, companyId })))
      .onConflictDoUpdate({
        target: [invoices.remoteId],
        set: {
          remoteId: sql.raw(`excluded.${invoices.remoteId.name}`),
          remainingRemoteContent: sql.raw(
            `excluded.${invoices.remainingRemoteContent.name}`,
          ),
          syncToken: sql.raw(`excluded.${invoices.syncToken.name}`),
          totalAmount: sql.raw(
            `excluded.${invoices.totalAmount.name}`,
          ),
          depositMade: sql.raw(
            `excluded.${invoices.depositMade.name}`,
          ),
          balanceRemaining: sql.raw(
            `excluded.${invoices.balanceRemaining.name}`,
          ),
          dueDate: sql.raw(`excluded.${invoices.dueDate.name}`),
          depositToAccountReferenceValue: sql.raw(
            `excluded.${invoices.depositToAccountReferenceValue.name}`,
          ),
          currency: sql.raw(`excluded.${invoices.currency.name}`),
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
      .from(invoices)
      .where(eq(invoices.companyId, companyId));

    return data;
  }

  async deleteByRemoteId(remoteId: string | string[]): Promise<void> {
    await this.db
      .delete(invoices)
      .where(
        inArray(
          invoices.remoteId,
          Array.isArray(remoteId) ? remoteId : [remoteId],
        ),
      );
  }

  async getByRemoteId(
    remoteId: string,
  ): Promise<QuickBooksInvoice | undefined> {
    const [data] = await this.db
      .select()
      .from(invoices)
      .where(eq(invoices.remoteId, remoteId))
      .limit(1);

    return data;
  }

  async getById(id: number): Promise<QuickBooksInvoice | undefined> {
    const [data] = await this.db
      .select()
      .from(invoices)
      .where(eq(invoices.id, id))
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
