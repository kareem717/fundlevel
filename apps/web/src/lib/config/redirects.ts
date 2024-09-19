import { Icons } from "@/components/icons";

export type Menu = {
	href: string;
	label: string;
	pathIdentifier: string;
	icon: keyof typeof Icons;
};

const myVentureNav: Menu[] = [
	{
		href: "/my-ventures/:id/edit",
		label: "Edit",
		pathIdentifier: "/my-ventures/:id/edit",
		icon: "edit",
	},
	{
		href: "/my-ventures/:id/rounds",
		label: "Rounds",
		pathIdentifier: "/my-ventures/:id/rounds",
		icon: "chartPie",
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
			myVentures: "/my-ventures",
			create: "/venture/create",
			view: "/venture/:id",
		},
		rounds: {
			myRounds: "/my-rounds",
			create: "/round/create",
			view: "/round/:id",
		},
	},
	myVentureNav,
};

export default redirects;
