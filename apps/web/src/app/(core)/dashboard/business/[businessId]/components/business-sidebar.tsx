"use client";

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
} from "@workspace/ui/components/sidebar";
import { ComponentPropsWithoutRef } from "react";
import { sidebar } from "@/lib/config/sidebar";
import { SidebarUser } from "@/components/sidebar/sidebar-user";
import { SidebarMenu } from "@/components/sidebar/sidebar-menu";
import { SidebarNotification } from "@/components/sidebar/sidebar-notification";
import { SidebarBusinessSwitcher } from "./sidebar-business-switcher";

export interface BusinessSidebarProps
  extends ComponentPropsWithoutRef<typeof Sidebar> {
  businessId: number;
}

//TODO: this doesn't have to be a client component
export function BusinessSidebar({
  businessId,
  ...props
}: BusinessSidebarProps) {
  const sidebarConfig = sidebar.businessDashboard(businessId);

  return (
    <Sidebar variant="inset" {...props}>
      <SidebarBusinessSwitcher />
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
