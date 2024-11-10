import { Icons } from "@/components/ui/icons";
import { LucideIcon } from "lucide-react";
import redirects from "./redirects";

export type NavigationItem = {
	title: string;
	url?: string;
	icon?: LucideIcon;
	items?: {
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
				title: "Investment History",
				url: redirects.app.portfolio.investments.index,
				icon: Icons.chart,
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
