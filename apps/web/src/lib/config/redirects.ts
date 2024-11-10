

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
				index: "/portfolio/investments",
				create: (roundId: string) => `/portfolio/investments/create/${roundId}`,
			},
		},
		dashboard: {
			index: "/dashboard",
			business: {
				create: "/dashboard/create-business",
			},
			funding: {
				index: "/dashboard/funding",
				investments: {
					index: "/dashboard/funding/investments",
				},
				investors: {
					index: "/dashboard/funding/investors",
				},
			},
		},
	},
};

export default redirects;
