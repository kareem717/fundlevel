const redirects = {
	privacy: "/privacy-policy",
	terms: "/terms-of-service",
	auth: {
		login: "/login",
		logout: "/logout",
		afterLogin: "/",
		afterLogout: "/login",
		callback: "/auth/callback",
		createAccount: "/create-account",
	},
	app: {
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
		dashboard: {
			index: "/dashboard",
			business: {
				create: "/dashboard/create-business",
				members: "/dashboard/members",
				settings: {
					root: "/dashboard/settings",
					stripe: "/dashboard/settings/profile",
				},
				stripe: {
					root: "/dashboard/stripe",
					dashboard: "/dashboard/stripe/dashboard",
					settings: "/dashboard/stripe/settings",
				},
			},
			funding: {
				index: "/dashboard/funding",
				investments: {
					index: "/dashboard/funding/investments",
				},
				investors: {
					index: "/dashboard/funding/investors",
				},
				rounds: {
					root: "/dashboard/funding/rounds",
					index: "/dashboard/funding/rounds",
					create: "/dashboard/funding/rounds/create",
				},
			},
		},
	},
};

export default redirects;
