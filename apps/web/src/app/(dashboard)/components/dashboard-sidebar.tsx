import { FundlevelLogo } from "@fundlevel/ui/components/custom/icons";
import {
	Sidebar,
	SidebarContent,
	SidebarFooter,
	SidebarGroup,
	SidebarGroupContent,
	SidebarHeader,
	SidebarMenu,
	SidebarMenuButton,
	SidebarMenuItem,
	SidebarProvider,
} from "@fundlevel/ui/components/sidebar";
import { cn } from "@fundlevel/ui/lib/utils";
import type { User } from "@workos-inc/node";
import Link from "next/link";
import type { ComponentPropsWithoutRef } from "react";
import { redirects } from "@/lib/config/redirects";
import { SidebarUser } from "./sidebar-user";

interface DashboardSidebarProps
	extends ComponentPropsWithoutRef<typeof Sidebar> {
	user: User;
}

export function DashboardSidebar({
	className,
	user,
	...props
}: DashboardSidebarProps) {
	return (
		<SidebarProvider className="items-start">
			<Sidebar
				collapsible="none"
				className={cn("hidden md:flex", className)}
				{...props}
			>
				<SidebarHeader>
					{/* <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton size="lg" asChild> */}
					<Link href={redirects.home} className="w-min">
						<FundlevelLogo className="w-40" />
					</Link>
					{/* </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu> */}
				</SidebarHeader>
				<SidebarContent>
					<SidebarGroup>
						<SidebarGroupContent>
							<SidebarMenu>
								{/* {Object.entries(DashboardTabs).map(([key, value]) => (
                  <SidebarMenuItem key={key}>
                    <SidebarMenuButton asChild isActive={currentTab === key}>
                      <Link to={"/dashboard"} search={{ tab: key }}>
                        <value.icon />
                        <span>{value.name}</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))} */}
								<SidebarMenuItem>
									<SidebarMenuButton asChild>
										<Link href={redirects.dashboard.index}>
											<span>Dashboard</span>
										</Link>
									</SidebarMenuButton>
								</SidebarMenuItem>
							</SidebarMenu>
						</SidebarGroupContent>
					</SidebarGroup>
				</SidebarContent>
				<SidebarFooter>
					<SidebarUser user={user} className="w-full" />
				</SidebarFooter>
			</Sidebar>
			{props.children}
		</SidebarProvider>
	);
}
