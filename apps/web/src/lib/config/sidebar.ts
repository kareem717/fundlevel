import {
  LayoutGrid,
  LogOut,
  Plug,
  Receipt,
  BookOpen,
  ReceiptText,
  CreditCard,
  FileText,
  ArrowDownUp,
  Wallet,
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
  // {
  //   name: "Banking",
  //   path: redirects.app.company(id).root,
  //   items: [
  //     {
  //       title: "Bank Accounts",
  //       url: redirects.app.company(id).bank.root,
  //       icon: Landmark,
  //     },
  //     {
  //       title: "Reconcile Transactions",
  //       url: redirects.app.company(id).bank.reconciliation,
  //       icon: Check,
  //     },
  //   ],
  // },
  {
    name: "Accounting",
    path: redirects.app.company(id).root,
    items: [
      {
        title: "Invoices",
        url: redirects.app.company(id).accounting.invoices,
        icon: Receipt,
      },
      {
        title: "Accounts",
        url: redirects.app.company(id).accounting.accounts,
        icon: BookOpen,
      },
      {
        title: "Transactions",
        url: redirects.app.company(id).accounting.transactions,
        icon: ArrowDownUp,
      },
      {
        title: "Journal Entries",
        url: redirects.app.company(id).accounting.journalEntries,
        icon: FileText,
      },
      {
        title: "Vendor Credits",
        url: redirects.app.company(id).accounting.vendorCredits,
        icon: ReceiptText,
      },
      {
        title: "Credit Notes",
        url: redirects.app.company(id).accounting.creditNotes,
        icon: CreditCard,
      },
      {
        title: "Payments",
        url: redirects.app.company(id).accounting.payments,
        icon: Wallet,
      },
    ],
  },
  {
    name: "Settings",
    path: redirects.app.company(id).settings.root,
    items: [
      {
        title: "Connections",
        url: redirects.app.company(id).settings.connections,
        icon: Plug,
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
