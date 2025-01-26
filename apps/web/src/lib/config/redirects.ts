const appRoot = "/";
const businessDashboardRoot = "/business";

// Helper function moved to top for clarity
const businessPrefix = (businessId: number, path?: string) =>
	`${businessDashboardRoot}/${businessId}${path ? `/${path}` : ""}`;

// Helper to reduce repetition in business dashboard paths
const businessPath = (businessId: number) => ({
	root: () => businessPrefix(businessId),
	path: (suffix: string) => businessPrefix(businessId, suffix),
});

export const redirects = {
	legal: {
		privacy: "/privacy",
		terms: "/terms",
	},
	auth: {
		callback: (redirect?: string) =>
			redirect ? `/auth/callback?redirect=${redirect}` : `/auth/callback`,
		login: "/login",
		logout: "/logout",
		afterLogout: "/login",
		afterLogin: appRoot,
		otp: (email: string) => `/otp?email=${email}`,
		createAccount: "/create-account",
	},
	app: {
		root: appRoot,
		wallet: {
			index: "/wallet",
			positions: {
				root: "/wallet/positions",
				investments: {
					root: "/wallet/positions/investments",
					history: "/wallet/positions/investments/history",
					payments: "/wallet/positions/investments/payments",
				},
			},
		},
		createBusiness: "/create-business",
		businessDashboard: (businessId: number) => ({
			root: businessPath(businessId).root(),
			members: businessPath(businessId).path("members"),
			settings: {
				root: businessPath(businessId).path("settings"),
				stripe: businessPath(businessId).path("settings/profile"),
			},
			funding: {
				index: businessPath(businessId).path("funding"),
				rounds: {
					root: businessPath(businessId).path("funding/rounds"),
					index: businessPath(businessId).path("funding/rounds"),
					create: businessPath(businessId).path("funding/rounds/create"),
				},
			},
		}),
		rounds: (roundId: number) => `/rounds/${roundId}`,
		settings: "/settings",
	},
};
