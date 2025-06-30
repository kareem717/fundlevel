"use client";

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
} from "@fundlevel/ui/components/sidebar";
import { SidebarMenu } from "@fundlevel/web/components/sidebar/sidebar-menu";
import type { ComponentPropsWithoutRef } from "react";
import { SidebarUser } from "@fundlevel/web/components/sidebar/sidebar-user";
import { sidebar } from "@fundlevel/web/lib/config/sidebar";
import { SidebarNotification } from "@fundlevel/web/components/sidebar/sidebar-notification";
import { LogoDiv } from "@fundlevel/web/components/logo-div";
import { redirects } from "@fundlevel/web/lib/config/redirects";
import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarMenuAction,
  SidebarMenu as SidebarMenuComponent,
} from "@fundlevel/ui/components/sidebar";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@fundlevel/ui/components/dropdown-menu";
import { MoreHorizontal, Plus, Search } from "lucide-react";
import Link from "next/link";
import { useIsMobile } from "@fundlevel/ui/hooks/use-mobile";
import { Skeleton } from "@fundlevel/ui/components/skeleton";
import { generate } from "shortid";
import { Avatar, AvatarFallback } from "@fundlevel/ui/components/avatar";
import { useUserCompanies } from "@fundlevel/web/hooks/use-user-companies";

const DISPLAY_COMPANIES = 3;
//TODO: this doesn't have to be a client component
export function DashboardSidebar({
  ...props
}: ComponentPropsWithoutRef<typeof Sidebar>) {
  const { dashboard } = sidebar;
  const isMobile = useIsMobile();

  //todo: optimize this
  const { data, isFetching } = useUserCompanies();

  const companies = data?.slice(0, DISPLAY_COMPANIES);
  const hasMore = data?.length > DISPLAY_COMPANIES;

  return (
    <Sidebar variant="inset" {...props}>
      <SidebarHeader className="flex items-center justify-center">
        <LogoDiv />
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup className="group-data-[collapsible=icon]:hidden">
          <SidebarGroupLabel>Companies</SidebarGroupLabel>
          <SidebarMenuComponent>
            <SidebarMenuItem>
              <Link href={redirects.app.createCompany}>
                <SidebarMenuButton>
                  <Plus />
                  <span>Add New</span>
                </SidebarMenuButton>
              </Link>
            </SidebarMenuItem>
            {isFetching ? (
              <div className="flex flex-col gap-2 px-2">
                {Array.from({ length: 2 }).map(() => (
                  <Skeleton
                    className="w-full h-6 rounded-sm"
                    key={generate()}
                  />
                ))}
              </div>
            ) : (
              companies.map((item) => (
                <SidebarMenuItem key={item.id}>
                  <SidebarMenuButton>
                    {/* <item.icon /> */}
                    <Avatar className="rounded-sm size-6">
                      <AvatarFallback className="rounded-none font-bold bg-muted-foreground">
                        {item.name
                          .split(" ")
                          .slice(0, 2)
                          .map((name) => name[0])
                          .join("")}
                      </AvatarFallback>
                    </Avatar>
                    <span>{item.name}</span>
                  </SidebarMenuButton>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <SidebarMenuAction showOnHover>
                        <MoreHorizontal />
                        <span className="sr-only">More</span>
                      </SidebarMenuAction>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent
                      className="w-48 rounded-lg"
                      side={isMobile ? "bottom" : "right"}
                      align={isMobile ? "end" : "start"}
                    >
                      <Link href={redirects.app.company(item.id).root} prefetch>
                        <DropdownMenuItem>
                          <Search className="text-muted-foreground" />
                          <span>View Company</span>
                        </DropdownMenuItem>
                      </Link>
                      {/* <DropdownMenuSeparator />
                      <DropdownMenuItem>
                        <Trash2 className="text-muted-foreground" />
                        <span>Delete Company</span>
                      </DropdownMenuItem> */}
                    </DropdownMenuContent>
                  </DropdownMenu>
                </SidebarMenuItem>
              ))
            )}
            {hasMore && (
              <SidebarMenuItem>
                <SidebarMenuButton className="text-sidebar-foreground/70">
                  <MoreHorizontal className="text-sidebar-foreground/70" />
                  <span>More</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
            )}
          </SidebarMenuComponent>
        </SidebarGroup>

        {dashboard.map((menu) => (
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
