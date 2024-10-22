import { ComponentPropsWithoutRef, FC } from "react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Account } from "@/lib/api";
import { Button } from "./button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Icons } from "./icons";
import { cn } from "@/lib/utils";
import Link from "next/link";
import redirects from "@/lib/config/redirects";

export interface AccountDropdownProps extends ComponentPropsWithoutRef<typeof Button> {
  account: Account
};

export const AccountDropdown: FC<AccountDropdownProps> = ({ account, className, ...props }) => {
  const intials = account.firstName.charAt(0) + account.lastName.charAt(0);

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button className={cn("flex items-center justify-center gap-2", className)} variant="outline" {...props}>
          <Icons.menu className="size-5" />
          <Avatar className="size-7">
            {/* <AvatarImage src="https://github.com/shadcn.png" /> */}
            <AvatarFallback >{intials.toUpperCase()}</AvatarFallback>
          </Avatar>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuLabel>My Account</DropdownMenuLabel>
        <DropdownMenuItem>
          <Link href={redirects.auth.logout}>Logout</Link>
        </DropdownMenuItem>
        <DropdownMenuItem>
          <Link href={redirects.app.settings.account}>Settings</Link>
        </DropdownMenuItem>
        <DropdownMenuItem>
          <Link href={redirects.app.investments.root}>My Investments</Link>
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuLabel>Business</DropdownMenuLabel>
        <DropdownMenuItem>
          <Link href={redirects.app.myBusinesses.index}>My Businesses</Link>
        </DropdownMenuItem>
        <DropdownMenuItem>
          <Link href={redirects.app.myBusinesses.create}>Create Business</Link>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};