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
		portfolio: {
			index: "/portfolio",
			investments: {
				index: "/portfolio/investments",
				checkout: "/portfolio/investments/:id/checkout",
			},
		},
		dashboard: {
			index: "/dashboard",
			business: {
				create: "/dashboard/create-business",
			},
		},
	},
};

export default redirects;
