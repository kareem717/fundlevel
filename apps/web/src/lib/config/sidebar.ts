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
        url: redirects.app.businessDashboard(businessId).settings,
        icon: Icons.settings,
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
    name: "Business",
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
  {
    name: "Portfolio",
    path: redirects.app.portfolio,
    items: [
      {
        title: "Overview",
        url: redirects.app.portfolio,
        icon: Icons.layoutGrid,
      },
    ],
  },
  {
    name: "Settings",
    path: redirects.app.root,
    items: [
      {
        title: "Account",
        url: redirects.app.settings,
        icon: Icons.user,
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
    path: redirects.app.portfolio,
    items: [
      {
        title: "Overview",
        url: redirects.app.portfolio,
        icon: Icons.chart,
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
  portfolio,
};
