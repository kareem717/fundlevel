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
 * An array of navigation items for the business dashboard.
 */
const dashboardNavigation: NavigationMenu[] = [
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
 * A configuration object for the navigation items.
 */
const NavConfig = {
	dashboard: dashboardNavigation,
};

export default NavConfig;
