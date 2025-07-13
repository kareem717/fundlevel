import { Button } from "@fundlevel/ui/components/button";
import { FundlevelIcon } from "@fundlevel/ui/components/custom/icons";
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
import { Home, MailIcon, Plug2Icon, PlusCircleIcon } from "lucide-react";
import Link from "next/link";
import type { ComponentPropsWithoutRef } from "react";
import { SidebarUser } from "./sidebar-user";

interface AppSidebarProps extends ComponentPropsWithoutRef<typeof Sidebar> {
	user: User;
}

const items = [
	{
		title: "Dashboard",
		icon: Home,
		href: redirects.app.index,
	},
	{
		title: "Integrations",
		icon: Plug2Icon,
		href: redirects.app.integrations,
	},
];

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
				<SidebarMenu>
					<SidebarMenuItem>
						<SidebarMenuButton asChild>
							{/* <a href="#">
								<IconInnerShadowTop className="!size-5" />
								<span className="text-base font-semibold">Acme Inc.</span>
							</a> */}
							<Link href={redirects.app.index} className="w-full">
								<FundlevelIcon className="!size-5" />
								<span className="font-semibold text-base">Fundlevel</span>
							</Link>
						</SidebarMenuButton>
					</SidebarMenuItem>
				</SidebarMenu>
			</SidebarHeader>
			<SidebarContent>
				<SidebarGroup>
					<SidebarGroupContent className="flex flex-col gap-2">
						<SidebarMenu>
							<SidebarMenuItem className="flex items-center gap-2">
								<SidebarMenuButton
									tooltip="Quick Create"
									className="min-w-8 bg-primary text-primary-foreground duration-200 ease-linear hover:bg-primary/90 hover:text-primary-foreground active:bg-primary/90 active:text-primary-foreground"
								>
									<PlusCircleIcon />
									<span>Quick Create</span>
								</SidebarMenuButton>
								<Button
									size="icon"
									className="size-8 group-data-[collapsible=icon]:opacity-0"
									variant="outline"
								>
									<MailIcon />
									<span className="sr-only">Inbox</span>
								</Button>
							</SidebarMenuItem>
						</SidebarMenu>
						<SidebarMenu>
							{items.map((item) => (
								<SidebarMenuItem key={item.title}>
									<SidebarMenuButton tooltip={item.title} asChild>
										<Link href={item.href}>
											{item.icon && <item.icon />}
											<span>{item.title}</span>
										</Link>
									</SidebarMenuButton>
								</SidebarMenuItem>
							))}
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
