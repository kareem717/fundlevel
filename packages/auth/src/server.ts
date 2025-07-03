import { getDb } from "@fundlevel/db";
import { auth as AuthSchema } from "@fundlevel/db/schema";
import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { openAPI } from "better-auth/plugins";
// import { reactStartCookies } from "better-auth/react-start";

export const API_KEY_HEADER_NAME = "x-api-key";

interface ServerClientConfig {
	basePath: string;
	databaseUrl: string;
	trustedOrigins: string[];
	googleClientId: string;
	googleClientSecret: string;
	baseDomain: string;
	// stripeConfig: {
	//   apiKey: string;
	//   webhookSecret: string;
	//   config?: Omit<Stripe.StripeConfig, "apiVersion">;
	//   env?: "production" | "sandbox";
	// };
}

export const createServerClient = ({
	basePath,
	databaseUrl,
	trustedOrigins,
	googleClientId,
	googleClientSecret,
	baseDomain = "localhost",
}: ServerClientConfig) => {
	// const stripeClient = new Stripe(stripeConfig.apiKey, {
	//   apiVersion: "2025-06-30.basil",
	//   ...stripeConfig.config,
	// });

	return betterAuth({
		basePath,
		database: drizzleAdapter(getDb(databaseUrl), {
			provider: "pg",
			schema: {
				...AuthSchema,
				// ...SubscriptionSchema,
			},
		}),
		// Allow requests from the frontend development server
		trustedOrigins,
		emailAndPassword: {
			enabled: true,
		},
		session: {
			cookieCache: {
				enabled: false, // causes sign-out to be weird on landing page
			},
			expiresIn: 60 * 60 * 24 * 7, // 7 days
			updateAge: 60 * 60 * 24, // 1 day (every 1 day the session expiration is updated)
			modelName: "sessions",
		},
		socialProviders: {
			google: {
				clientId: googleClientId,
				clientSecret: googleClientSecret,
			},
		},
		verification: {
			modelName: "verifications",
		},
		account: {
			modelName: "accounts",
		},
		user: {
			modelName: "users",
		},
		advanced: {
			database: {
				generateId: false,
			},
			crossSubDomainCookies: {
				enabled: true,
				domain: `.${baseDomain}`, // Domain with a leading period
			},
			defaultCookieAttributes: {
				secure: true,
				httpOnly: true,
				sameSite: "none", // Allows CORS-based cookie sharing across subdomains
				partitioned: true, // New browser standards will mandate this for foreign cookies
			},
		},
		plugins: [
			openAPI({
				path: "/docs",
			}),
			// apiKey({
			//   apiKeyHeaders: API_KEY_HEADER_NAME,
			// }),
			// stripe({
			//   stripeClient,
			//   stripeWebhookSecret: stripeConfig.webhookSecret,
			//   createCustomerOnSignUp: true,
			//   getCustomerCreateParams: async (data, request) => {
			//     return {
			//       userId: data.user.id,
			//     };
			//   },
			//   getCheckoutSessionParams: () => {
			//     return {
			//       params: {
			//         allow_promotion_codes: true,
			//       },
			//     };
			//   },
			//   onCustomerCreate: async (data, request) => {},
			//   subscription: {
			//     enabled: true,
			//     plans: SubscriptionPlans(stripeConfig.env).map(
			//       (plan) => plan.stripePlan,
			//     ),
			//   },
			//   schema: {
			//     subscription: {
			//       modelName: "subscriptions",
			//     },
			//   },
			// }),
			// reactStartCookies(), // Has to be the last plugin
		],
	});
};
