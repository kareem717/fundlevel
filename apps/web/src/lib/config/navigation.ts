import { Icons } from "@/components/ui/icons";
import { LucideIcon } from "lucide-react";
import redirects from "./redirects";

export type NavigationItem =
	| {
			title: string;
			icon?: LucideIcon;
			items: {
				title: string;
				url: string;
			}[];
	  }
	| {
			title: string;
			url: string;
			icon?: LucideIcon;
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
				icon: Icons.handCoins,
				items: [
					{
						title: "Overview",
						url: redirects.app.businessDashboard.investors.root,
					},
					{
						title: "Offers",
						url: redirects.app.businessDashboard.investors.offers,
					},
				],
			},
			{
				title: "Financials",
				url: redirects.app.businessDashboard.financials,
				icon: Icons.dollarSign,
			},
			{
				title: "Rounds",
				url: redirects.app.businessDashboard.rounds,
				icon: Icons.chart,
			},
			{
				title: "Ventures",
				url: redirects.app.businessDashboard.ventures,
				icon: Icons.store,
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
