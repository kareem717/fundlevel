import type { IReconciliationService } from "../interfaces";
import type {
  IBankingRepository,
  IInvoiceRepository,
  GetManyTransactionsFilter,
} from "@fundlevel/api/internal/storage/interfaces";
import { createOpenAI } from "@ai-sdk/openai";
import { generateObject } from "ai";
import { z } from "zod";

export class ReconciliationService implements IReconciliationService {
  constructor(
    private bankRepo: IBankingRepository,
    private invoiceRepo: IInvoiceRepository,
    private readonly openAiKey: string,
  ) {}

  async reconcileInvoice(invoiceId: number) {
    const invoiceRecord = await this.invoiceRepo.get({
      id: invoiceId,
    });

    if (!invoiceRecord) {
      throw new Error("Invoice not found");
    }

    const openai = createOpenAI({
      apiKey: this.openAiKey,
    });

    // Step 1: Analyze invoice to determine transaction filter parameters
    const filterParams = await generateObject({
      model: openai("gpt-4o"),
      system: `
        You are a financial data analyst specialized in matching invoices to banking transactions.
        Your task is to analyze an invoice and suggest filter parameters that will help find matching bank transactions.
        Consider the invoice amount, date, and other relevant details to create an optimal filter.

        Remember that:
        - Invoices can be paid in
      `,
      prompt: `
        Analyze this invoice and suggest filter parameters to find matching bank transactions:
        ${JSON.stringify(invoiceRecord, null, 2)}
      `,
      schema: z.object({
        minAmount: z
          .number()
          .optional()
          .describe("The minimum amount of the transaction"),
        maxAmount: z
          .number()
          .optional()
          .describe("The maximum amount of the transaction"),
        minAuthorizedAt: z
          .string()
          .optional()
          .describe("The minimum date of the transaction"),
        maxAuthorizedAt: z
          .string()
          .optional()
          .describe("The maximum date of the transaction"),
      }),
    });

    console.log(filterParams.object);
    // Step 2: Analyze filtered transactions to find matches
    const { remainingRemoteContent, ...invoice } = invoiceRecord;

    let cursor: string | null = null;
    const transactionJobs = [];
    while (cursor !== null) {
      // Get transactions using the AI-suggested filters
      const transactionResult = await this.bankRepo.getManyTransactions({
        // ...filterParams.object,
        // minAmount: 0,
        companyIds: [invoiceRecord.companyId],
        limit: 5,
        order: "asc",
        cursor,
        bankAccountIds: undefined,
      });

      console.log("transactionResult.data", transactionResult.data);

      transactionJobs.push(transactionResult.data);
      cursor = transactionResult.nextCursor;
    }

    console.log("transactionJobs", transactionJobs);

    const result = await Promise.all(
      transactionJobs.map(async (transactionJob) => {
        return await generateObject({
          model: openai("gpt-4o-mini"),
          system: `
          You are a financial data processor specialized in matching banking transactions to invoices.
          Your task is to analyze the filtered bank transactions and identify which ones are most likely to match the given invoice.
          Consider transaction amounts, dates, merchant names, and descriptions to find the best matches.
        `,
          prompt: `
          Find the best matching transactions for this invoice:
          
          Invoice:
          ${JSON.stringify(invoice, null, 2)}

          Available Transactions:
          ${JSON.stringify(transactionJob, null, 2)}
        `,
          schema: z.object({
            transactions: z.array(
              z.object({
                transactionId: z.string(),
                confidence: z.enum(["low", "medium", "high"]),
                matchReason: z
                  .string()
                  .describe(
                    "A short explanation of why this transaction is a good match for the invoice",
                  ),
              }),
            ),
          }),
        });
      }),
    );

    const suggestedTransactions = result.flatMap((r) => r.object.transactions);

    console.log(suggestedTransactions);

    return suggestedTransactions;
  }
}
