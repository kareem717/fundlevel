import { ComponentPropsWithoutRef, FC } from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@repo/ui/components/dropdown-menu";
import { Account } from "@repo/sdk";
import { buttonVariants } from "@repo/ui/components/button";
import { Avatar, AvatarFallback } from "@repo/ui/components/avatar";
import { Icons } from "./icons";
import { cn } from "@repo/ui/lib/utils";
import Link from "next/link";
import { redirects } from "@/lib/config/redirects";

export interface AccountDropdownProps
  extends ComponentPropsWithoutRef<typeof DropdownMenuTrigger> {
  account: Account;
}

export const AccountDropdown: FC<AccountDropdownProps> = ({
  account,
  className,
  ...props
}) => {
  const intials = account.firstName.charAt(0) + account.lastName.charAt(0);

  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        className={cn(
          "flex items-center justify-center gap-2",
          buttonVariants({ variant: "outline" }),
          className
        )}
        {...props}
      >
        <Icons.menu className="size-5" />
        <Avatar className="size-7">
          <AvatarFallback>{intials.toUpperCase()}</AvatarFallback>
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
          <DropdownMenuLabel>Business</DropdownMenuLabel>
          <DropdownMenuItem>
            <Link href={redirects.dashboard.index}>Dashboard</Link>
          </DropdownMenuItem>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <DropdownMenuLabel>Investor</DropdownMenuLabel>
          <DropdownMenuItem>
            <Link href={redirects.dashboard.wallet.index}>Wallet</Link>
          </DropdownMenuItem>
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
