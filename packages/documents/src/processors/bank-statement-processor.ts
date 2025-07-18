import { createMistral } from "@ai-sdk/mistral";
import { transactionSchema } from "@fundlevel/db/schema";
import type { BankStatement } from "@fundlevel/db/types";
import { generateObject } from "ai";
import env from "../env";
import { BANK_STATEMENT_EXTRACTION_PROMPT } from "../prompts";
import { ExtractTransactionSchema } from "../schema";
import type { ExtractableDocument } from "../types/document";
import { getDB } from "../utils/db";

export class BankStatementProcessor {
	async processDocument(
		input: ExtractableDocument & {
			userId: string;
			bankStatementId: BankStatement["id"];
		},
	) {
		const mistralClient = createMistral({
			apiKey: env.MISTRAL_API_KEY,
		});

		let aiResp;
		try {
			aiResp = await generateObject({
				model: mistralClient("mistral-small-latest"),
				output: "array",
				schema: ExtractTransactionSchema,
				abortSignal: AbortSignal.timeout(1000 * 120),
				messages: [
					{
						role: "system",
						content: BANK_STATEMENT_EXTRACTION_PROMPT,
					},
					{
						role: "user",
						content: [
							{
								type: "file",
								data: input.url,
								mimeType: input.mimeType,
							},
						],
					},
				],
				providerOptions: {
					mistral: {
						documentPageLimit: 10,
					},
				},
			});
		} catch (error) {
			throw new Error("Failed to run OCR on document.", { cause: error });
		}

		try {
			const db = getDB();
			// Insert transactions and update status to "done" in a transaction
			return await db.transaction(async (tx) => {
				// Insert transactions into database
				const result = await tx
					.insert(transactionSchema.transactions)
					.values(
						aiResp.object.map((transaction) => ({
							...transaction,
							userId: input.userId,
							bankStatementId: input.bankStatementId,
						})),
					)
					.returning();

				return result;
			});
		} catch (error) {
			throw new Error("Failed to insert transactions.", { cause: error });
		}
	}
}
