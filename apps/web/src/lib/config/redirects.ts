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
		portfolio: {
			index: "/portfolio",
			investments: {
				root: "/portfolio/investments",
				history: "/portfolio/investments/history",
				insights: "/portfolio/investments/insights",
				payments: "/portfolio/investments/payments",
				create: (roundId: string) => `/portfolio/investments/create/${roundId}`,
			},
			positions: {
				index: "/portfolio/positions",
			},
		},
		dashboard: {
			index: "/dashboard",
			business: {
				create: "/dashboard/create-business",
				members: "/dashboard/members",
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
