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
		explore: {
			index: "/",
			venture: {
				view: (id: string) => `/ventures/${id}`,
			},
			round: {
				view: (id: string) => `/rounds/${id}`,
			},
		},
		wallet: {
			index: "/portfolio",

			positions: {
				root: "/portfolio/positions",
				investments: {
					root: "/portfolio/investments",
					payments: "/portfolio/investments/payments",
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
