import { Icons } from "@/components/icons";
import { LucideIcon } from "lucide-react";
import redirects from "./redirects";

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
const dashboard: NavigationMenu[] = [
	{
		name: "Business",
		path: redirects.app.index,
		items: [
			{
				title: "Overview",
				url: redirects.app.index,
				icon: Icons.layoutGrid,
			},
			{
				title: "Members",
				url: redirects.app.business.members,
				icon: Icons.users,
			},
			{
				title: "Settings",
				root: redirects.app.business.settings.root,
				icon: Icons.settings,
				items: [
					{
						title: "Profile",
						url: redirects.app.business.settings.stripe,
					},
				],
			},
			{
				title: "Stripe",
				root: redirects.app.business.stripe.root,
				icon: Icons.settings,
				items: [
					{
						title: "Dashboard",
						url: redirects.app.business.stripe.dashboard,
					},
					{
						title: "Settings",
						url: redirects.app.business.stripe.settings,
					},
				],
			},
		],
	},
	{
		name: "Funding",
		path: redirects.app.funding.index,
		items: [
			{
				title: "Overview",
				url: redirects.app.funding.index,
				icon: Icons.chart,
			},
			{
				title: "Investments",
				url: redirects.app.funding.investments.index,
				icon: Icons.handCoins,
			},
			{
				title: "Investors",
				url: redirects.app.funding.investors.index,
				icon: Icons.users,
			},
			{
				title: "Rounds",
				root: redirects.app.funding.rounds.root,
				icon: Icons.handCoins,
				items: [
					{
						title: "Overview",
						url: redirects.app.funding.rounds.index,
					},
					{
						title: "Create",
						url: redirects.app.funding.rounds.create,
					},
				],
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
const SidebarConfig = {
	dashboard,
	wallet,
};

export default SidebarConfig;
