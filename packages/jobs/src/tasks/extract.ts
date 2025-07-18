import { SelectBankStatementSchema } from "@fundlevel/db/validation";
import { BankStatementProcessor } from "@fundlevel/documents/processors/bank-statement-processor";
import { logger, schemaTask } from "@trigger.dev/sdk/v3";
import { z } from "zod";

export const extractBankStatement = schemaTask({
	id: "bank-statement-extraction",
	maxDuration: 300, // Stop executing after 300 secs (5 mins) of compute
	schema: z.object({
		userId: z.string(),
		bankStatementId: SelectBankStatementSchema.pick({ id: true }).shape.id,
		url: z.string().url(),
		mimeType: z.string(),
		fileName: z.string(),
	}),
	run: async (payload, { ctx }) => {
		logger.log("Extracting bank statement", { payload, ctx });
		const processor = new BankStatementProcessor();

		try {
			const result = await processor.processDocument({
				userId: payload.userId,
				bankStatementId: payload.bankStatementId,
				url: payload.url,
				mimeType: payload.mimeType,
				name: payload.fileName,
			});

			logger.log("Finished extracting bank statement", { result });

			return {
				message: "Finished extracting bank statement",
				result,
			};
		} catch (error) {
			if (error instanceof Error) {
				logger.error(error.message, { cause: error.cause });
			} else {
				logger.error("Error extracting bank statement", { error });
			}
		}
	},
});
