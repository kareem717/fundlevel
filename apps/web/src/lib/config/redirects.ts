import { Icons } from "@/components/ui/icons";

export type Menu = {
	href: string;
	label: string;
	pathIdentifier: string;
	icon: keyof typeof Icons;
};

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
			ventureView: "/ventures/:id",
			roundView: "/rounds/:id",
		},
		settings: {
			account: "/settings?tab=account",
		},
		investments: {
			root: "/investments",
			checkout: "/investments/:investmentId/checkout",
		},
		businessDashboard: {
			root: "/my-business",
			investors: {
				root: "/my-business/investors",
				offers: "/my-business/investors/offers",
			},
			financials: "/my-business/financials",
			rounds: "/my-business/rounds",
			ventures: "/my-business/ventures",
		},
		myBusinesses: {
			index: "/my-businesses",
			view: {
				rounds: {
					root: "/my-businesses/:id/rounds",
					view: "/my-businesses/:id/rounds/:roundId",
					create: "/my-businesses/:id/rounds/create",
				},
				investments: "/my-businesses/:id/investments",
				ventures: {
					root: "/my-businesses/:id/ventures",
					view: {
						root: "/my-businesses/:id/ventures/:ventureId",
						edit: "/my-businesses/:id/ventures/:ventureId/edit",
					},
					create: "/my-business/:id/ventures/create",
				},
			},
			create: "/my-businesses/create",
		},
		rounds: {
			myRounds: {
				root: "/my-rounds",
				view: "/my-rounds/:id",
			},
			create: "/rounds/create",
			view: "/rounds/:id",
		},
	},
};

export default redirects;
