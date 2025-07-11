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
} from "@fundlevel/ui/components/sidebar";
import { cn } from "@fundlevel/ui/lib/utils";
import { redirects } from "@fundlevel/web/lib/config/redirects";
import type { User } from "@workos-inc/node";
import Link from "next/link";
import type { ComponentPropsWithoutRef } from "react";
import { SidebarUser } from "./sidebar-user";

interface AppSidebarProps extends ComponentPropsWithoutRef<typeof Sidebar> {
	user: User;
}

export function AppSidebar({
	className,
	user,
	children,
	...props
}: AppSidebarProps) {
	return (
		<Sidebar
			variant="inset"
			className={cn("hidden md:flex", className)}
			{...props}
		>
			<SidebarHeader>
				{/* <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton size="lg" asChild> */}
				<Link href={redirects.app.index} className="w-min">
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
									<Link href={redirects.app.index}>
										<span>Dashboard</span>
									</Link>
								</SidebarMenuButton>
							</SidebarMenuItem>
							<SidebarMenuItem>
								<SidebarMenuButton asChild>
									<Link href={redirects.app.bankStatements}>
										<span>Bank Statements</span>
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
	);
}
