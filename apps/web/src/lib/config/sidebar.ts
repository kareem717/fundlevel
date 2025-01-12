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
			{
				title: "Stripe",
				root: redirects.app.businessDashboard(businessId).stripe.root,
				icon: Icons.settings,
				items: [
					{
						title: "Dashboard",
						url: redirects.app.businessDashboard(businessId).stripe.dashboard,
					},
					{
						title: "Settings",
						url: redirects.app.businessDashboard(businessId).stripe.settings,
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
				title: "Investments",
				url: redirects.app.businessDashboard(businessId).funding.investments
					.index,
				icon: Icons.handCoins,
			},
			{
				title: "Investors",
				url: redirects.app.businessDashboard(businessId).funding.investors
					.index,
				icon: Icons.users,
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
		name: "Businesses",
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
