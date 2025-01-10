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
		index: "",
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

export default redirects;
