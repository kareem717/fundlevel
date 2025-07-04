import { connections } from "@fundlevel/db/schema";
import type { NangoWebhookBody } from "@nangohq/node";
import { Hono } from "hono";
import { HTTPException } from "hono/http-exception";
import { db } from "@/lib/utils/db";
import { nangoClient } from "@/lib/utils/nango";

const webhookRouter = new Hono().post("/nango", async (c) => {
	let body: NangoWebhookBody;
	try {
		const rawBody = await c.req.raw.json();

		const signature = c.req.header("x-nango-signature") ?? "";

		const valid = nangoClient.verifyWebhookSignature(signature, rawBody);

		if (!valid) {
			return c.json({ error: "Invalid webhook signature" }, 401);
		}

		body = rawBody as NangoWebhookBody;
		console.log("Nango webhook received:", body);
	} catch (err) {
		console.error("Error processing Nango webhook:", err);
		throw new HTTPException(500, {
			message: "Failed to process Nango webhook.",
		});
	}

	// TODO: add business logic here, e.g. updating DB, queuing jobs, etc.
	if (body.type === "auth") {
		if (!body.endUser?.endUserId) {
			throw new HTTPException(400, {
				message: "Missing end user ID",
			});
		}

		switch (body.operation) {
			case "creation":
				try {
					await db.insert(connections.nangoConnections).values({
						id: body.connectionId,
						provider: body.provider,
						user_id: Number.parseInt(body.endUser.endUserId),
					});
				} catch (err) {
					console.error("Error inserting Nango connection:", err);
					throw new HTTPException(500, {
						message: "Failed to insert Nango connection",
					});
				}
				break;
			default:
				throw new HTTPException(400, {
					message: "Invalid operation",
				});
		}
	}

	throw new HTTPException(400, {
		message: "Invalid webhook type",
	});
});

export { webhookRouter };
