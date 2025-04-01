import type { IBankTransactionRepository, IBillRepository } from "@fundlevel/api/internal/storage/interfaces";
import type { GetManyBillsFilter } from "@fundlevel/api/internal/entities";
import type { Bill } from "@fundlevel/db/types";
import type { OffsetPaginationResult } from "@fundlevel/api/internal/entities";
import type { IBillService } from "../interfaces";
import { createOpenAI } from "@ai-sdk/openai";
import { generateObject } from "ai";
import { z } from "zod";

export class BillService implements IBillService {
  constructor(
    private readonly billRepo: IBillRepository,
    private readonly bankTxRepo: IBankTransactionRepository,
    private readonly openAiKey: string,
  ) { }

  async getMany(filter: GetManyBillsFilter): Promise<OffsetPaginationResult<Bill>> {
    return this.billRepo.getMany(filter);
  }

  async get(billId: number): Promise<Bill> {
    const bill = await this.billRepo.get({ id: billId });
    if (!bill) {
      throw new Error("Bill not found");
    }

    return bill;
  }

  async getManyLines(filter: { billId: number } | { ids: number[] }) {
    return this.billRepo.getManyLines(filter);
  }

  async reconcile(billId: number) {
    const billRecord = await this.billRepo.get({
      id: billId,
    });

    if (!billRecord) {
      throw new Error("Bill not found");
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
        - Invoices can be paid in installments, so the amount is not always the same
        - Positive amounts are debits, negative amounts are credits
      `,
      prompt: `
        Analyze this invoice and suggest filter parameters to find matching bank transactions:
        ${JSON.stringify({
        ...billRecord,
        // We need to negate the amount to make it a credit
        amount: (billRecord.totalAmount ?? 0) * -1,
      }, null, 2)}
      `,
      schema: z.object({
        minAmount: z
          .number()
          .optional()
          .describe("The minimum credit amount of the transaction"),
        maxAmount: z
          .number()
          .optional()
          .describe("The maximum credit amount of the transaction"),
        minDate: z
          .string()
          .optional()
          .describe("The minimum date of the transaction"),
        maxDate: z
          .string()
          .optional()
          .describe("The maximum date of the transaction"),
      }),
    });

    console.log(filterParams.object);
    // Step 2: Analyze filtered transactions to find matches
    const { remainingRemoteContent, ...bill } = billRecord;

    const PAGE_SIZE = 5;
    let pageIdx = 0;
    const initialTransactions = await this.bankTxRepo.getMany({
      ...filterParams.object,
      companyIds: [billRecord.companyId],
      sortBy: "id",
      pageSize: PAGE_SIZE,
      order: "asc",
      page: pageIdx,
    });

    const transactionJobs = initialTransactions.data;
    while (pageIdx < initialTransactions.totalPages) {
      pageIdx++;

      // Get transactions using the AI-suggested filters
      const transactionResult = await this.bankTxRepo.getMany({
        ...filterParams.object,
        companyIds: [billRecord.companyId],
        pageSize: PAGE_SIZE,
        order: "asc",
        sortBy: "id",
        page: pageIdx,
      });

      transactionJobs.push(...transactionResult.data);
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

          DO NOT return any transactions that do not match the invoice.
          
          Remember that:
          - Invoices can be paid in installments
          - Positive amounts are debits, negative amounts are credits.
        `,
          prompt: `
          Find the best matching transactions for this invoice:
          
          Invoice:
          ${JSON.stringify({
            ...bill,
            // We need to negate the amount to make it a credit
            amount: (bill.totalAmount ?? 0) * -1,
          }, null, 2)}

          Available Transactions:
          ${JSON.stringify(transactionJob, null, 2)}
        `,
          schema: z.object({
            transactions: z.array(
              z.object({
                transactionId: z.number().min(1).describe("The ID of the transaction"),
                confidence: z.enum(["low", "medium", "high"]).describe("The confidence level of the match"),
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

    return suggestedTransactions;
  }
} 