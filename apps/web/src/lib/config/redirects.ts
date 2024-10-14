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
		explore: "/explore",
		settings: {
			account: "/settings?tab=account",
		},
		ventures: {
			myVentures: {
				view: "/my-ventures/:id",
				index: "/my-ventures",
			},
			create: "/ventures/create",
			view: "/ventures/:id",
		},
		rounds: {
			myRounds: {
				root: "/my-rounds",
				view: "/my-rounds/:id",
			},
			create: "/rounds/create",
			view: "/rounds/:id",
		},
		investments: {
			myInvestments: {
				root: "/my-investments",
				recieved: {
					root: "/my-investments/recieved",
					view: "/my-investments/recieved/:id",
				},
			},
		},
	},
	myVentureNav,
};

export default redirects;
