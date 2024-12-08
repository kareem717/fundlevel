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
		path: redirects.app.dashboard.index,
		items: [
			{
				title: "Overview",
				url: redirects.app.dashboard.index,
				icon: Icons.layoutGrid,
			},
			{
				title: "Members",
				root: redirects.app.dashboard.business.members.root,
				icon: Icons.users,
				items: [
					{
						title: "Overview",
						url: redirects.app.dashboard.business.members.index,
					},
					{
						title: "Roles",
						url: redirects.app.dashboard.business.members.roles,
					},
				],
			},
		],
	},
	{
		name: "Funding",
		path: redirects.app.dashboard.funding.index,
		items: [
			{
				title: "Overview",
				url: redirects.app.dashboard.funding.index,
				icon: Icons.chart,
			},
			{
				title: "Investments",
				url: redirects.app.dashboard.funding.investments.index,
				icon: Icons.handCoins,
			},
			{
				title: "Investors",
				url: redirects.app.dashboard.funding.investors.index,
				icon: Icons.users,
			},
			{
				title: "Rounds",
				root: redirects.app.dashboard.funding.rounds.root,
				icon: Icons.handCoins,
				items: [
					{
						title: "Overview",
						url: redirects.app.dashboard.funding.rounds.index,
					},
					{
						title: "Create",
						url: redirects.app.dashboard.funding.rounds.create,
					},
				],
			},
		],
	},
];

/**
 * An array of navigation items for the portfolio dashboard sidebar.
 */
const portfolio: NavigationMenu[] = [
	{
		name: "Portfolio",
		path: redirects.app.portfolio.index,
		items: [
			{
				title: "Overview",
				url: redirects.app.portfolio.index,
				icon: Icons.layoutGrid,
			},
		],
	},
	{
		name: "Holdings",
		path: redirects.app.portfolio.index,
		items: [
			{
				title: "Investments",
				root: redirects.app.portfolio.investments.root,
				icon: Icons.chart,
				items: [
					{
						title: "Insights",
						url: redirects.app.portfolio.investments.insights,
					},
					{
						title: "History",
						url: redirects.app.portfolio.investments.history,
					},
					{
						title: "Payments",
						url: redirects.app.portfolio.investments.payments,
					},
				],
			},
			{
				title: "Positions",
				url: redirects.app.portfolio.positions.index,
				icon: Icons.briefcase,
			},
		],
	},
];

/**
 * A configuration object for sidebar navigation items.
 */
const SidebarConfig = {
	dashboard,
	portfolio,
};

export default SidebarConfig;
