import { OpenAPIHono } from "@hono/zod-openapi";
import type { OCRResponse } from "@mistralai/mistralai/models/components";
import * as Sentry from "@sentry/cloudflare";
import { HTTPException } from "hono/http-exception";
import { createMistralClient } from "@/lib/utils/mistral";
import { getAuth } from "@/middleware/with-auth";
import { ocrRoutes } from "./routes";

export const ocrHandler = () =>
	new OpenAPIHono().openapi(ocrRoutes.process, async (c) => {
		const { user } = getAuth(c);
		if (!user) {
			throw new HTTPException(403, { message: "Unauthorized" });
		}

		const { file } = await c.req.valid("form");

		const fileBuffer = await file.arrayBuffer();
		const base64Pdf = Buffer.from(fileBuffer).toString("base64");

		const mistralClient = createMistralClient();

		let ocrResponse: OCRResponse;
		try {
			const pages = await Sentry.startSpan(
				{
					name: "OCR Process",
					op: "ocr.process",
				},
				async () => {
					const startTime = performance.now();
					ocrResponse = await mistralClient.ocr.process({
						model: "mistral-ocr-latest",
						document: {
							type: "document_url",
							documentUrl: `data:${file.type};base64,${base64Pdf}`,
						},
						includeImageBase64: true,
					});

					const { pages, usageInfo } = ocrResponse;

					const span = Sentry.getActiveSpan();
					if (span) {
						span.setAttribute(
							"ocr.doc_size_bytes",
							usageInfo.docSizeBytes ?? 0,
						);
						span.setAttribute("ocr.pages_processed", usageInfo.pagesProcessed);
						span.setAttribute(
							"ocr.processing_time_ms",
							performance.now() - startTime,
						);
					}

					return pages.map(({ index, markdown }) => ({
						index,
						markdown,
					}));
				},
			);

			return c.json(pages, 200);
		} catch (error) {
			throw new HTTPException(500, {
				message: "Failed to create connect session token.",
				cause: error,
			});
		}
	});
