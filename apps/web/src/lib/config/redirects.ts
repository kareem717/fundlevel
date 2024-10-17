import { Icons } from "@/components/ui/icons";

export type Menu = {
	href: string;
	label: string;
	pathIdentifier: string;
	icon: keyof typeof Icons;
};

const myVentureNav: Menu[] = [
	{
		href: "/my-ventures/:id",
		label: "Overview",
		pathIdentifier: "/my-ventures/:id",
		icon: "home",
	},
	{
		href: "/my-ventures/:id/rounds",
		label: "Rounds",
		pathIdentifier: "/my-ventures/:id/rounds",
		icon: "chartPie",
	},
	{
		href: "/my-ventures/:id/investments",
		label: "Investments",
		pathIdentifier: "/my-ventures/:id/investments",
		icon: "chart",
	},
];

const redirects = {
	home: "/",
	privacy: "/privacy-policy",
	terms: "/terms-of-service",
	auth: {
		login: "/login",
		logout: "/logout",
		afterLogin: "/explore",
		afterLogout: "/login",
		callback: "/auth/callback",
		createAccount: "/create-account",
	},
	app: {
		explore: {
			index: "/explore",
			ventureView: "/explore/ventures/:id",
			roundView: "/explore/rounds/:id",
		},
		settings: {
			account: "/settings?tab=account",
		},
		investments: {
			root: "/investments",
			checkout: "/investments/:investmentId/checkout",
		},
		myBusinesses: {
			index: "/my-businesses",
			view: {
				root: "/my-businesses/:id",
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
					create: "/my-businesses/:id/ventures/create",
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
	myVentureNav,
};

export default redirects;
