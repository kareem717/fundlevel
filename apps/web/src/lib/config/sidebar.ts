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
		name: "Business Dashboard",
		path: redirects.app.dashboard.index,
		items: [
			{
				title: "Overview",
				url: redirects.app.dashboard.index,
				icon: Icons.layoutGrid,
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
				title: "Investments",
				url: redirects.app.portfolio.investments.index,
				icon: Icons.chart,
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
