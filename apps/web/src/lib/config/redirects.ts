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
		portfolio: "/portfolio",
		createBusiness: "/create-business",
		businessDashboard: (businessId: number) => ({
			root: businessPath(businessId).root(),
			members: businessPath(businessId).path("members"),
			settings: businessPath(businessId).path("settings"),
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
