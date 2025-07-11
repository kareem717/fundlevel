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
import { redirects } from "@fundlevel/web/lib/config/redirects";
import type { User } from "@workos-inc/node";
import { ChevronsUpDown, LogOut } from "lucide-react";
import Link from "next/link";
import type { ComponentPropsWithoutRef } from "react";

interface SidebarUserProps
	extends ComponentPropsWithoutRef<typeof SidebarMenu> {
	user: User;
}

export function SidebarUser({ className, user, ...props }: SidebarUserProps) {
	const { firstName, lastName, profilePictureUrl } = user;

	const [firstInitial = "", lastInitial = ""] = (
		firstName ??
		lastName ??
		""
	).split(" ");
	const initials = `${firstInitial}${lastInitial}`.toUpperCase();

	const name = firstName && lastName ? `${firstName} ${lastName}` : user.email;
	return (
		<SidebarMenu {...props}>
			<SidebarMenuItem>
				<DropdownMenu>
					<SidebarMenuButton asChild>
						<DropdownMenuTrigger className="w-full">
							<div className="flex w-full items-center justify-between gap-2">
								<Avatar className="size-7" {...props}>
									{profilePictureUrl && <AvatarImage src={profilePictureUrl} />}
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
									{profilePictureUrl && <AvatarImage src={profilePictureUrl} />}
									<AvatarFallback>{initials}</AvatarFallback>
								</Avatar>
								<div className="grid flex-1 text-left text-sm leading-tight">
									<span className="truncate font-semibold">{name}</span>
									<span className="truncate text-xs">{user.email}</span>
								</div>
							</div>
						</DropdownMenuLabel>
						<DropdownMenuSeparator />
						<DropdownMenuItem asChild>
							<Link href={redirects.auth.signOut}>
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
