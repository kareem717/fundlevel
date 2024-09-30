import { Icons } from "@/components/icons";

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
			account: "/settings/account",
			billing: "/settings/billing",
		},
		venture: {
			myVentures: {
				view: "/my-ventures/:id",
				index: "/my-ventures",
				create: "/my-ventures/create",
			},
			view: "/venture/:id",
		},
		rounds: {
			myRounds: {
				root: "/my-rounds",
				view: "/my-rounds/:id",
				overview: "/my-rounds",
				regularDynamic: "/my-rounds/regular-dynamic",
				dutchDynamic: "/my-rounds/dutch-dynamic",
				partialTotal: "/my-rounds/partial-total",
				fixedTotal: "/my-rounds/fixed-total",
				create: {
					root: "/my-rounds/create",
					fixedTotal: "/my-rounds/create/fixed-total",
					partialTotal: "/my-rounds/create/partial-total",
					regularDynamic: "/my-rounds/create/regular-dynamic",
					dutchDynamic: "/my-rounds/create/dutch-dynamic",
				},
			},
			view: "/round/:id",
		},
	},
	myVentureNav,
};

export default redirects;
