import { Home, LayoutGrid, LogOut } from "lucide-react";
import { redirects } from "./redirects";
import type { ElementType } from "react";

export type NavigationItem =
  | {
    title: string;
    url: string;
    icon?: ElementType;
  }
  | {
    title: string;
    root: string;
    icon?: ElementType;
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
 * An array of navigation items for the dashboard sidebar.
 */
const dashboard: NavigationMenu[] = [
  {
    name: "Linked Accounts",
    path: redirects.app.root,
    items: [
      {
        title: "View All",
        url: redirects.app.root,
      },
    ],
  },
  {
    name: "Account",
    path: redirects.app.root,
    items: [
      {
        title: "Logout",
        url: redirects.auth.logout,
        icon: LogOut
      },
    ],
  },
];

const linkedAccountDashboard = (id: number): NavigationMenu[] => [
  {
    name: "Linked Account",
    path: redirects.app.linkedAccount(id).root,
    items: [
      {
        title: "Overview",
        url: redirects.app.linkedAccount(id).root,
        icon: LayoutGrid,
      },
    ],
  },
];

/**
 * A configuration object for sidebar navigation items.
 */
export const sidebar = {
  dashboard,
  linkedAccountDashboard
};
