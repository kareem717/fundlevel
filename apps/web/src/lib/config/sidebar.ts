import { Icons } from "@/components/icons";
import { LucideIcon } from "lucide-react";
import { redirects } from "./redirects";

export type NavigationItem =
	| {
			title: string;
			url: string;
			icon?: LucideIcon;
	  }
	| {
			title: string;
			root: string;
			icon?: LucideIcon;
			items: {
				title: string;
				url: string;
			}[];
	  };

export type NavigationMenu = {
	name: string;
	path: string;
	items: NavigationItem[];
};

/**
 * An array of navigation items for the business dashboard sidebar.
 */
const businessDashboard = (businessId: number): NavigationMenu[] => [
	{
		name: "Business",
		path: redirects.app.root,
		items: [
			{
				title: "Overview",
				url: redirects.app.root,
				icon: Icons.layoutGrid,
			},
			{
				title: "Members",
				url: redirects.app.businessDashboard(businessId).members,
				icon: Icons.users,
			},
			{
				title: "Settings",
				root: redirects.app.businessDashboard(businessId).settings.root,
				icon: Icons.settings,
				items: [
					{
						title: "Profile",
						url: redirects.app.businessDashboard(businessId).settings.stripe,
					},
				],
			},
		],
	},
	{
		name: "Funding",
		path: redirects.app.businessDashboard(businessId).funding.index,
		items: [
			{
				title: "Overview",
				url: redirects.app.businessDashboard(businessId).funding.index,
				icon: Icons.chart,
			},
			{
				title: "Rounds",
				root: redirects.app.businessDashboard(businessId).funding.rounds.root,
				icon: Icons.handCoins,
				items: [
					{
						title: "Overview",
						url: redirects.app.businessDashboard(businessId).funding.rounds
							.index,
					},
					{
						title: "Create",
						url: redirects.app.businessDashboard(businessId).funding.rounds
							.create,
					},
				],
			},
		],
	},
];

/**
 * An array of navigation items for the dashboard sidebar.
 */
const dashboard: NavigationMenu[] = [
	{
		name: "Business",
		path: redirects.app.root,
		items: [
			{
				title: "Overview",
				url: redirects.app.root,
				icon: Icons.layoutGrid,
			},
			{
				title: "Create",
				url: redirects.app.createBusiness,
				icon: Icons.add,
			},
		],
	},
	{
		name: "Wallet",
		path: redirects.app.wallet.index,
		items: [
			{
				title: "Overview",
				url: redirects.app.wallet.index,
				icon: Icons.layoutGrid,
			},
		],
	},
	{
		name: "Settings",
		path: redirects.app.root,
		items: [
			{
				title: "Account",
				url: redirects.app.settings,
				icon: Icons.user,
			},
		],
	},
];

/**
 * An array of navigation items for the wallet dashboard sidebar.
 */
const wallet: NavigationMenu[] = [
	{
		name: "Wallet",
		path: redirects.app.wallet.index,
		items: [
			{
				title: "Overview",
				url: redirects.app.wallet.index,
				icon: Icons.layoutGrid,
			},
		],
	},
	{
		name: "Positions",
		path: redirects.app.wallet.positions.root,
		items: [
			{
				title: "Investments",
				root: redirects.app.wallet.positions.investments.root,
				icon: Icons.chart,
				items: [
					{
						title: "History",
						url: redirects.app.wallet.positions.investments.history,
					},
					{
						title: "Payments",
						url: redirects.app.wallet.positions.investments.payments,
					},
				],
			},
		],
	},
];

/**
 * A configuration object for sidebar navigation items.
 */
export const sidebar = {
	businessDashboard,
	dashboard,
	wallet,
};
