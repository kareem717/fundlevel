import { AccountDropdown } from "@/components/ui/account-dropdown";
import { LogoDiv } from "@/components/ui/logo-div";
import { cn } from "@/lib/utils";
import { ComponentPropsWithoutRef, FC } from "react"
import { Account } from "@/lib/api";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ModeToggle } from "@/components/ui/mode-toggle";
import { ExploreNavbar } from "./explore-navbar";
export interface ExploreHeaderProps extends ComponentPropsWithoutRef<"header"> {
  account?: Account
};

export const ExploreHeader: FC<ExploreHeaderProps> = ({ account, className, ...props }) => {
  return (
    <header className={cn("flex items-start justify-between w-full pt-2 pb-6", className)} {...props}  >
      <LogoDiv />
      <ExploreNavbar />
      <div className="flex items-center justify-center gap-2">
        <Link href="/" className="text-sm mr-2">
          List on Fundlevel
        </Link>
        {account ?
          <AccountDropdown account={account} /> :
          <Link href="/login">
            <Button>Login</Button>
          </Link>
        }
        <ModeToggle variant="outline" />
      </div>
    </header>
  );
};