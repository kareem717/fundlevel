import type { AuthUser } from "@fundlevel/auth/types";
import {
	Avatar,
	AvatarFallback,
	AvatarImage,
} from "@fundlevel/ui/components/avatar";
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
} from "@fundlevel/ui/components/sidebar";
import { Link } from "@tanstack/react-router";
import { ChevronsUpDown, LogOut } from "lucide-react";
import type { ComponentPropsWithoutRef } from "react";

interface SidebarUserProps
	extends ComponentPropsWithoutRef<typeof SidebarMenu> {
	user: AuthUser;
}

export function SidebarUser({ className, user, ...props }: SidebarUserProps) {
	const { name, image } = user;

	const [firstName = "", lastName = ""] = (name ?? "").split(" ");
	const firstInitial = firstName[0] ?? "";
	const lastInitial = lastName[0] ?? "";
	const initials = `${firstInitial}${lastInitial}`.toUpperCase();
	return (
		<SidebarMenu {...props}>
			<SidebarMenuItem>
				<DropdownMenu>
					<SidebarMenuButton asChild>
						<DropdownMenuTrigger className="w-full">
							<div className="flex w-full items-center justify-between gap-2">
								<Avatar className="size-7" {...props}>
									{image && <AvatarImage src={image} />}
									<AvatarFallback>{initials}</AvatarFallback>
								</Avatar>
								<div className="flex flex-col">
									<span className="text-muted-foreground text-xs">{name}</span>
									<span className="font-medium text-xs">{user.email}</span>
								</div>
								<ChevronsUpDown className="size-4" />
							</div>
						</DropdownMenuTrigger>
					</SidebarMenuButton>
					<DropdownMenuContent
						className="w-full rounded-lg"
						align="end"
						sideOffset={4}
					>
						<DropdownMenuLabel className="p-0 font-normal">
							<div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
								<Avatar>
									{user.image && <AvatarImage src={user.image} />}
									<AvatarFallback>{user.name?.[0]}</AvatarFallback>
								</Avatar>
								<div className="grid flex-1 text-left text-sm leading-tight">
									<span className="truncate font-semibold">{user.name}</span>
									<span className="truncate text-xs">{user.email}</span>
								</div>
							</div>
						</DropdownMenuLabel>
						<DropdownMenuSeparator />
						<DropdownMenuItem asChild>
							<Link to="/sign-out">
								<LogOut className="size-4" />
								Sign out
							</Link>
						</DropdownMenuItem>
					</DropdownMenuContent>
				</DropdownMenu>
			</SidebarMenuItem>
		</SidebarMenu>
	);
}
