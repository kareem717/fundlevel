import type { ComponentPropsWithoutRef, FC } from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@fundlevel/ui/components/dropdown-menu";
import { buttonVariants } from "@fundlevel/ui/components/button";
import { Avatar, AvatarFallback } from "@fundlevel/ui/components/avatar";
import { cn } from "@fundlevel/ui/lib/utils";
import Link from "next/link";
import { redirects } from "@/lib/config/redirects";
import { Menu } from "lucide-react";
import type { Account } from "@fundlevel/api/types";

export interface AccountDropdownProps
  extends ComponentPropsWithoutRef<typeof DropdownMenuTrigger> {
  account: Account;
}

export const AccountDropdown: FC<AccountDropdownProps> = ({
  account,
  className,
  ...props
}) => {
  // const intials = account.first_name.charAt(0) + account.last_name.charAt(0);

  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        className={cn(
          "flex items-center justify-center gap-2",
          buttonVariants({ variant: "outline" }),
          className,
        )}
        {...props}
      >
        <Menu className="size-5" />
        <Avatar className="size-7">
          <AvatarFallback />
        </Avatar>
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuGroup>
          <DropdownMenuLabel>Account</DropdownMenuLabel>
          <DropdownMenuItem>
            <Link href={redirects.auth.logout}>Logout</Link>
          </DropdownMenuItem>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          {/* <DropdownMenuLabel>Dashboard</DropdownMenuLabel> */}
          <DropdownMenuItem>
            <Link href={redirects.app.root}>Dashboard</Link>
          </DropdownMenuItem>
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
