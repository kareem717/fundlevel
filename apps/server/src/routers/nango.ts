import { ORPCError } from "@orpc/client";
import { z } from "zod";
import { protectedProcedure } from "@/lib/orpc";
import { NangoIntegration, nangoClient } from "@/lib/utils/nango";

export const nangoRouter = {
	"session-token": protectedProcedure
		.route({ method: "POST", description: "Get a session token for Nango" })
		.input(
			z.object({
				integration: z.enum(
					Object.values(NangoIntegration) as [string, ...string[]],
				),
			}),
		)
		.handler(async ({ context }) => {
			try {
				const res = await nangoClient.createConnectSession({
					end_user: {
						id: context.session.user.id,
						email: context.session.user.email,
						display_name: context.session.user.name,
					},
					allowed_integrations: [
						NangoIntegration.QUICKBOOKS_SANDBOX,
						NangoIntegration.QUICKBOOKS,
					],
				});

				return res.data.token;
			} catch (error) {
				throw new ORPCError("INTERNAL_SERVER_ERROR", {
					cause: error,
					message: "Failed to create connect session token.",
				});
			}
		}),
};
