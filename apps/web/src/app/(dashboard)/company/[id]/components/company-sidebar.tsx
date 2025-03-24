"use client";

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
} from "@fundlevel/ui/components/sidebar";
import type { ComponentPropsWithoutRef } from "react";
import { sidebar } from "@fundlevel/web/lib/config/sidebar";
import { SidebarUser } from "@fundlevel/web/components/sidebar/sidebar-user";
import { SidebarMenu } from "@fundlevel/web/components/sidebar/sidebar-menu";
import { SidebarNotification } from "@fundlevel/web/components/sidebar/sidebar-notification";
import { Companieswitcher } from "./company-switcher";

export interface CompaniesidebarProps
  extends ComponentPropsWithoutRef<typeof Sidebar> {
  accountId: number;
}

//TODO: this doesn't have to be a client component
export function Companiesidebar({ accountId, ...props }: CompaniesidebarProps) {
  const sidebarConfig = sidebar.companyDashboard(accountId);

  return (
    <Sidebar variant="inset" {...props}>
      <Companieswitcher />
      <SidebarContent>
        {sidebarConfig.map((menu) => (
          <SidebarMenu key={menu.name} config={menu} />
        ))}
      </SidebarContent>
      <SidebarFooter>
        <SidebarNotification notificationId="identity-not-verified" />
        <SidebarUser />
      </SidebarFooter>
    </Sidebar>
  );
}
