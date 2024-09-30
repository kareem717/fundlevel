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
				href: redirects.app.venture.myVentures.index,
				label: "My Ventures",
				pathIdentifier: redirects.app.venture.myVentures.index,
				icon: "store",
				submenus: [],
			},
			{
				href: redirects.app.venture.myVentures.create,
				label: "Create",
				pathIdentifier: redirects.app.venture.myVentures.create,
				icon: "add",
				submenus: [],
			},
		],
	},
	{
		groupLabel: "Rounds",
		menus: [
			{
				href: "",
				label: "My Rounds",
				pathIdentifier: redirects.app.rounds.myRounds.root,
				icon: "chartPie",
				submenus: [
					{
						href: redirects.app.rounds.myRounds.overview,
						label: "Overview",
						pathIdentifier: redirects.app.rounds.myRounds.overview,
					},
					{
						href: redirects.app.rounds.myRounds.regularDynamic,
						label: "Regular Dynamic",
						pathIdentifier: redirects.app.rounds.myRounds.regularDynamic,
					},

					{
						href: redirects.app.rounds.myRounds.dutchDynamic,
						label: "Dutch Dynamic",
						pathIdentifier: redirects.app.rounds.myRounds.dutchDynamic,
					},

					{
						href: redirects.app.rounds.myRounds.fixedTotal,
						label: "Fixed Total",
						pathIdentifier: redirects.app.rounds.myRounds.fixedTotal,
					},

					{
						href: redirects.app.rounds.myRounds.partialTotal,
						label: "Partial Total",
						pathIdentifier: redirects.app.rounds.myRounds.partialTotal,
					},
				],
			},
			{
				href: "",
				label: "Create",
				pathIdentifier: redirects.app.rounds.myRounds.create.root,
				icon: "add",
				submenus: [
					{
						href: redirects.app.rounds.myRounds.create.regularDynamic,
						label: "Regular Dynamic",
						pathIdentifier: redirects.app.rounds.myRounds.create.regularDynamic,
					},
					{
						href: redirects.app.rounds.myRounds.create.dutchDynamic,
						label: "Dutch Dynamic",
						pathIdentifier: redirects.app.rounds.myRounds.create.dutchDynamic,
					},

					{
						href: redirects.app.rounds.myRounds.create.fixedTotal,
						label: "Fixed Total",
						pathIdentifier: redirects.app.rounds.myRounds.create.fixedTotal,
					},

					{
						href: redirects.app.rounds.myRounds.create.partialTotal,
						label: "Partial Total",
						pathIdentifier: redirects.app.rounds.myRounds.create.partialTotal,
					},
				],
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
