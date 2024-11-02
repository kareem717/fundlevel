import { Icons } from "@/components/ui/icons";
import { LucideIcon } from "lucide-react";
import redirects from "./redirects";

export type NavigationItem = {
	title: string;
	url: string;
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
 * An array of navigation items for the business dashboard.
 */
const businessDashboardNavigation: NavigationMenu[] = [
	{
		name: "Business Dashboard",
		path: redirects.app.businessDashboard.root,
		items: [
			{
				title: "Overview",
				url: redirects.app.businessDashboard.root,
				icon: Icons.layoutGrid,
			},
			{
				title: "Investors",
				url: redirects.app.businessDashboard.investors,
				icon: Icons.handCoins,
			},
			{
				title: "Financials",
				url: redirects.app.businessDashboard.investors,
				icon: Icons.dollarSign,
			},
			{
				title: "Rounds",
				url: redirects.app.businessDashboard.investors,
				icon: Icons.chart,
			},
			{
				title: "Ventures",
				url: redirects.app.businessDashboard.investors,
				icon: Icons.store,
			},
			{
				title: "Members",
				url: redirects.app.businessDashboard.investors,
				icon: Icons.users,
			},
		],
	},
];

/**
 * A configuration object for the navigation items.
 */
const NavConfig = {
	businessDashboard: businessDashboardNavigation,
};

export default NavConfig;
