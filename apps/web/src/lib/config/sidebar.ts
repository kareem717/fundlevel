import {
  LayoutGrid,
  LogOut,
  Plug,
  Receipt,
  Landmark,
  Plus,
} from "lucide-react";
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
    name: "Account",
    path: redirects.app.root,
    items: [
      {
        title: "Logout",
        url: redirects.auth.logout,
        icon: LogOut,
      },
    ],
  },
];

const companyDashboard = (id: number): NavigationMenu[] => [
  {
    name: "Company",
    path: redirects.app.company(id).root,
    items: [
      {
        title: "Overview",
        url: redirects.app.company(id).root,
        icon: LayoutGrid,
      },
    ],
  },
  {
    name: "Banking",
    path: redirects.app.company(id).root,
    items: [
      {
        title: "Bank Accounts",
        url: redirects.app.company(id).bankAccounts.index,
        icon: Landmark,
      },
    ],
  },
  {
    name: "Accounting",
    path: redirects.app.company(id).root,
    items: [
      {
        title: "Invoices",
        url: redirects.app.company(id).invoices.index,
        icon: Receipt,
      },
    ],
  },
  {
    name: "Connections",
    path: redirects.app.company(id).connections.root,
    items: [
      {
        title: "Banking",
        url: redirects.app.company(id).connections.banking,
        icon: Plug,
      },
      {
        title: "Accounting",
        url: redirects.app.company(id).connections.accounting,
        icon: Receipt,
      },
    ],
  },
];

/**
 * A configuration object for sidebar navigation items.
 */
export const sidebar = {
  dashboard,
  companyDashboard,
};
