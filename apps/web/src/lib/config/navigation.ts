import { Icons } from "@/components/icons";
import redirects from "./redirects";

export type Submenu = {
	href: string;
	label: string;
	pathIdentifier: string;
};

export type Menu = {
	href: string;
	label: string;
	pathIdentifier: string;
	icon: keyof typeof Icons;
	submenus: Submenu[];
};

export type Group = {
	groupLabel: string;
	menus: Menu[];
};

const NavigationConfig: Group[] = [
	{
		groupLabel: "",
		menus: [
			{
				href: redirects.app.explore,
				label: "Explore",
				pathIdentifier: redirects.app.explore,
				icon: "layoutGrid",
				submenus: [],
			},
		],
	},
	{
		groupLabel: "Ventures",
		menus: [
			{
				href: redirects.app.ventures.myVentures.index,
				label: "My Ventures",
				pathIdentifier: redirects.app.ventures.myVentures.index,
				icon: "store",
				submenus: [],
			},
			{
				href: redirects.app.ventures.create,
				label: "Create",
				pathIdentifier: redirects.app.ventures.create,
				icon: "add",
				submenus: [],
			},
		],
	},
	{
		groupLabel: "Rounds",
		menus: [
			{
				href: redirects.app.rounds.myRounds.root,
				label: "My Rounds",
				pathIdentifier: redirects.app.rounds.myRounds.root,
				icon: "chartPie",
				submenus: [],
			},
			{
				href: redirects.app.rounds.create,
				label: "Create",
				pathIdentifier: redirects.app.rounds.create,
				icon: "add",
				submenus: [],
			},
		],
	},
	{
		groupLabel: "Investments",
		menus: [
			{
				href: "#",
				label: "My Investments",
				pathIdentifier: "#",
				icon: "chartPie",
				submenus: [],
			},
			{
				href: "#",
				label: "Received",
				pathIdentifier: "#",
				icon: "bookmark",
				submenus: [],
			},
		],
	},
	{
		groupLabel: "Settings",
		menus: [
			{
				href: redirects.app.settings.account,
				label: "Account",
				pathIdentifier: redirects.app.settings.account,
				icon: "users",
				submenus: [],
			},
		],
	},
];

export default NavigationConfig;
