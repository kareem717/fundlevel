"use client";

import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@repo/ui/components/avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@repo/ui/components/dropdown-menu"
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@repo/ui/components/sidebar"
import { ComponentPropsWithoutRef } from "react"
import Link from "next/link"
import { redirects } from "@/lib/config/redirects"
import { ChevronsUpDown, LogOut, Settings } from "lucide-react";
import { ModeToggle } from "@/components/mode-toggle";
import { useAuth } from "../providers/auth-provider";

export function SidebarUser({ ...props }: ComponentPropsWithoutRef<typeof SidebarMenu>) {
  const { isMobile } = useSidebar()
  const { user, account } = useAuth()

  if (!user || !account) {
    throw new Error("SidebarUser must be used within an AuthProvider with a user and account")
  }

  const firstName = account.first_name
  const lastName = account.last_name
  const avatar = user.user_metadata.avatar
  const email = user.email

  return (
    <SidebarMenu {...props}>
      <SidebarMenuItem>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <SidebarMenuButton
              size="lg"
              className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
            >
              <Avatar className="h-8 w-8 rounded-lg">
                <AvatarFallback className="rounded-lg">
                  {firstName[0]}
                  {lastName[0]}
                </AvatarFallback>
              </Avatar>
              <div className="grid flex-1 text-left text-sm leading-tight">
                <span className="truncate font-semibold">
                  {firstName} {lastName}
                </span>
                <span className="truncate text-xs">{email}</span>
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
                <Avatar className="h-8 w-8 rounded-lg">
                  {avatar && <AvatarImage src={avatar} />}
                  <AvatarFallback className="rounded-lg">
                    {firstName[0]}
                    {lastName[0]}
                  </AvatarFallback>
                </Avatar>
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-semibold">
                    {firstName} {lastName}
                  </span>
                  <span className="truncate text-xs">{email}</span>
                </div>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuGroup>
              <DropdownMenuItem asChild>
                <Link href={redirects.app.settings} >
                  <Settings />
                  Settings
                </Link>
              </DropdownMenuItem>
            </DropdownMenuGroup>
            <DropdownMenuSeparator />
            <DropdownMenuItem>
              <Link href={redirects.auth.logout} className="w-full flex items-center justify-start gap-2">
                <LogOut className="size-4" />
                Log out
              </Link>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <ModeToggle />
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
  );
};