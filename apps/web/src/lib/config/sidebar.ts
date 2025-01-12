import { Icons } from "@/components/icons";
import { LucideIcon } from "lucide-react";
import { redirects } from "./redirects";
import BusinessDashboard from "@/app/(core)/dashboard/business/[businessId]/page";

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
		path: redirects.dashboard.index,
		items: [
			{
				title: "Overview",
				url: redirects.dashboard.index,
				icon: Icons.layoutGrid,
			},
			{
				title: "Members",
				url: redirects.dashboard.businessDashboard(businessId).members,
				icon: Icons.users,
			},
			{
				title: "Settings",
				root: redirects.dashboard.businessDashboard(businessId).settings.root,
				icon: Icons.settings,
				items: [
					{
						title: "Profile",
						url: redirects.dashboard.businessDashboard(businessId).settings
							.stripe,
					},
				],
			},
			{
				title: "Stripe",
				root: redirects.dashboard.businessDashboard(businessId).stripe.root,
				icon: Icons.settings,
				items: [
					{
						title: "Dashboard",
						url: redirects.dashboard.businessDashboard(businessId).stripe
							.dashboard,
					},
					{
						title: "Settings",
						url: redirects.dashboard.businessDashboard(businessId).stripe
							.settings,
					},
				],
			},
		],
	},
	{
		name: "Funding",
		path: redirects.dashboard.businessDashboard(businessId).funding.index,
		items: [
			{
				title: "Overview",
				url: redirects.dashboard.businessDashboard(businessId).funding.index,
				icon: Icons.chart,
			},
			{
				title: "Investments",
				url: redirects.dashboard.businessDashboard(businessId).funding
					.investments.index,
				icon: Icons.handCoins,
			},
			{
				title: "Investors",
				url: redirects.dashboard.businessDashboard(businessId).funding.investors
					.index,
				icon: Icons.users,
			},
			{
				title: "Rounds",
				root: redirects.dashboard.businessDashboard(businessId).funding.rounds
					.root,
				icon: Icons.handCoins,
				items: [
					{
						title: "Overview",
						url: redirects.dashboard.businessDashboard(businessId).funding
							.rounds.index,
					},
					{
						title: "Create",
						url: redirects.dashboard.businessDashboard(businessId).funding
							.rounds.create,
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
		path: redirects.dashboard.index,
		items: [
			{
				title: "Overview",
				url: redirects.dashboard.index,
				icon: Icons.layoutGrid,
			},
			{
				title: "Create",
				url: redirects.dashboard.createBusiness,
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
		path: redirects.dashboard.wallet.index,
		items: [
			{
				title: "Overview",
				url: redirects.dashboard.wallet.index,
				icon: Icons.layoutGrid,
			},
		],
	},
	{
		name: "Positions",
		path: redirects.dashboard.wallet.positions.root,
		items: [
			{
				title: "Investments",
				root: redirects.dashboard.wallet.positions.investments.root,
				icon: Icons.chart,
				items: [
					{
						title: "History",
						url: redirects.dashboard.wallet.positions.investments.history,
					},
					{
						title: "Payments",
						url: redirects.dashboard.wallet.positions.investments.payments,
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
