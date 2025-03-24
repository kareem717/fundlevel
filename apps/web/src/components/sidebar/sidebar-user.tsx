"use client";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@fundlevel/ui/components/dropdown-menu";
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@fundlevel/ui/components/sidebar";
import type { ComponentPropsWithoutRef } from "react";
import Link from "next/link";
import { redirects } from "@fundlevel/web/lib/config/redirects";
import { ChevronsUpDown, LogOut } from "lucide-react";
import { ModeToggle } from "@fundlevel/web/components/mode-toggle";
import { useAuth } from "../providers/auth-provider";
import { stringToGradient } from "@fundlevel/web/lib/utils";
import { Avatar } from "@fundlevel/ui/components/avatar";
export function SidebarUser({
  ...props
}: ComponentPropsWithoutRef<typeof SidebarMenu>) {
  const { isMobile } = useSidebar();
  const { account } = useAuth()

  if (!account) {
    throw new Error(
      "SidebarUser must be used within an AccountProvider with an account",
    );
  }

  const avatarStyle = {
    background: stringToGradient(account.email)
  };

  return (
    <SidebarMenu {...props}>
      <SidebarMenuItem>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <SidebarMenuButton
              size="lg"
              className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
            >
              <Avatar className="h-8 w-8 rounded-full" style={avatarStyle} />
              <div className="grid flex-1 text-left text-sm leading-tight">
                <span className="truncate font-semibold">
                  {account.firstName} {account.lastName}
                </span>
                <span className="truncate text-xs">{account.email}</span>
              </div>
              <ChevronsUpDown className="ml-auto size-4" />
            </SidebarMenuButton>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            className="w-[--radix-dropdown-menu-trigger-width] min-w-56 rounded-lg"
            side={isMobile ? "bottom" : "right"}
            align="end"
            sideOffset={4}
          >
            <DropdownMenuLabel className="p-0 font-normal">
              <div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
                <Avatar className="h-8 w-8 rounded-full" style={avatarStyle} />
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-semibold">
                    {account.firstName} {account.lastName}
                  </span>
                  <span className="truncate text-xs">{account.email}</span>
                </div>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem>
              <Link
                href={redirects.auth.logout}
                className="w-full flex items-center justify-start gap-2"
              >
                <LogOut className="size-4" />
                Log out
              </Link>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <ModeToggle className="w-full" />
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
  );
}
