import { Icons } from "@/components/ui/icons";
import { LucideIcon } from "lucide-react";

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
	items: NavigationItem[];
};

/**
 * An array of navigation items for the business dashboard.
 */
export const businessDashboardNavigation: NavigationMenu[] = [
	{
		name: "Business Dashboard",
		items: [
			{
				title: "Dashboard",
				url: "/owner/dashboard",
				icon: Icons.layoutGrid,
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
