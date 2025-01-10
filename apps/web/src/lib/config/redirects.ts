const appIndex = "/";

export const redirects = {
	privacy: "/privacy-policy",
	terms: "/terms-of-service",
	auth: {
		callback: "/auth/callback",
		login: "/login",
		logout: "/logout",
		afterLogout: "/login",
		afterLogin: appIndex,
		otp: (email: string) => `/otp?email=${email}`,
		createAccount: "/create-account",
	},
	app: {
		index: appIndex,
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
		business: {
			create: "/create-business",
			members: "/members",
			settings: {
				root: "/settings",
				stripe: "/settings/profile",
			},
			stripe: {
				root: "/stripe",
				dashboard: "/stripe/dashboard",
				settings: "/stripe/settings",
			},
		},
		funding: {
			index: "/funding",
			investments: {
				index: "/funding/investments",
			},
			investors: {
				index: "/funding/investors",
			},
			rounds: {
				root: "/funding/rounds",
				index: "/funding/rounds",
				create: "/funding/rounds/create",
			},
		},
	},
};

