import { Home } from "lucide-react";
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
    name: "Dashboard",
    path: redirects.app.root,
    items: [
      {
        title: "Home",
        url: redirects.app.root,
        icon: Home,
      },
    ],
  },
];

/**
 * A configuration object for sidebar navigation items.
 */
export const sidebar = {
  dashboard,
};
