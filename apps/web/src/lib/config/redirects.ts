const dashboardRoot = "/dashboard";

// Helper function moved to top for clarity
const businessPrefix = (businessId: number, path?: string) =>
	`${dashboardRoot}/${businessId}${path ? `/${path}` : ""}`;

// Helper to reduce repetition in business dashboard paths
const businessPath = (businessId: number) => ({
	root: () => businessPrefix(businessId),
	path: (suffix: string) => businessPrefix(businessId, suffix),
});

export const redirects = {
	privacy: "/privacy-policy",
	terms: "/terms-of-service",
	auth: {
		callback: "/auth/callback",
		login: "/login",
		logout: "/logout",
		afterLogout: "/login",
		afterLogin: dashboardRoot,
		otp: (email: string) => `/otp?email=${email}`,
		createAccount: "/create-account",
	},
	app: {
		index: dashboardRoot,
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
			stripe: {
				root: businessPath(businessId).path("stripe"),
				dashboard: businessPath(businessId).path("stripe/dashboard"),
				settings: businessPath(businessId).path("stripe/settings"),
			},
			funding: {
				index: businessPath(businessId).path("funding"),
				investments: {
					index: businessPath(businessId).path("funding/investments"),
				},
				investors: {
					index: businessPath(businessId).path("funding/investors"),
				},
				rounds: {
					root: businessPath(businessId).path("funding/rounds"),
					index: businessPath(businessId).path("funding/rounds"),
					create: businessPath(businessId).path("funding/rounds/create"),
				},
			},
		}),
	},
};
