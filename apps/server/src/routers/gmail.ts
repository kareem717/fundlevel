import { protectedProcedure, publicProcedure } from "../lib/orpc";

// Gmail OAuth and inbox management router
export const gmailRouter = {
	// Link a Gmail inbox to the user's account
	linkInbox: protectedProcedure.handler(async ({ context }) => {
		const user = context.session?.user;
		if (!user) {
			throw new Error("Unauthorized");
		}

		// Generate OAuth URL for Gmail with required scopes
		const scopes = [
			"openid",
			"email",
			"profile",
			"https://www.googleapis.com/auth/gmail.readonly",
			"https://www.googleapis.com/auth/gmail.modify"
		];

		// Note: For simplicity, using a fixed inbox email for demo purposes
		// In a real implementation, this would come from user input
		const inboxEmail = `docs@${user.email?.split("@")[1] || "example.com"}`;

		const oauthUrl = `https://accounts.google.com/o/oauth2/v2/auth?` +
			`client_id=GOOGLE_CLIENT_ID&` +
			`redirect_uri=${encodeURIComponent(`BETTER_AUTH_URL/api/gmail/callback`)}&` +
			`response_type=code&` +
			`scope=${encodeURIComponent(scopes.join(" "))}&` +
			`access_type=offline&` +
			`prompt=consent&` +
			`state=${encodeURIComponent(JSON.stringify({ 
				userId: user.id, 
				inboxEmail: inboxEmail 
			}))}`;

		return { oauthUrl, inboxEmail };
	}),

	// Webhook handler for Gmail push notifications  
	handleEmailWebhook: publicProcedure.handler(async () => {
		try {
			// TODO: Process the email notification
			// This would involve:
			// 1. Finding the inbox listener for this email address
			// 2. Fetching new messages using Gmail API
			// 3. Processing attachments with document detection
			// 4. Logging the processing results

			console.log("Received Gmail webhook");

			return { success: true };
		} catch (error) {
			console.error("Gmail webhook processing error:", error);
			throw new Error("Failed to process email webhook");
		}
	}),

	// Get user's linked inbox listeners
	getInboxListeners: protectedProcedure.handler(async ({ context }) => {
		const user = context.session?.user;
		if (!user) {
			throw new Error("Unauthorized");
		}

		// TODO: Query database for user's inbox listeners
		// Return list of configured inboxes with status

		return {
			listeners: [],
		};
	}),

	// Remove an inbox listener
	removeInboxListener: protectedProcedure.handler(async ({ context }) => {
		const user = context.session?.user;
		if (!user) {
			throw new Error("Unauthorized");
		}

		// TODO: Remove inbox listener and cleanup
		// This would involve:
		// 1. Stopping Gmail watch
		// 2. Deleting Pub/Sub subscription
		// 3. Removing database records

		return { success: true };
	}),
};