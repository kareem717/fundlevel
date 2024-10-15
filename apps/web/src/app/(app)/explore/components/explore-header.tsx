import { AccountDropdown } from "@/components/ui/account-dropdown";
import { LogoDiv, SmallLogoDiv } from "@/components/ui/logo-div";
import { cn } from "@/lib/utils";
import { ComponentPropsWithoutRef, FC } from "react"
import { Account } from "@/lib/api";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ModeToggle } from "@/components/ui/mode-toggle";
import { ExploreSearch } from "./explore-search";
import redirects from "@/lib/config/redirects";
import { ExploreToggle } from "./explore-toggle";
export interface ExploreHeaderProps extends ComponentPropsWithoutRef<"header"> {
  account?: Account
};

export const ExploreHeader: FC<ExploreHeaderProps> = ({ account, className, ...props }) => {
  return (
    <header className={cn("grid grid-rows-1 w-full bg-background border-b border-border py-2 md:py-4", className)} {...props}  >
      <div className={"flex items-start justify-between w-full relative"}>
        <LogoDiv className="hidden lg:block my-auto" />
        <SmallLogoDiv className="lg:hidden my-auto" />
        <ExploreToggle className="hidden md:block absolute top-0 left-1/2 transform -translate-x-1/2" />
        <div className="flex items-center justify-center gap-2">
          <Link href="#" className="text-sm mr-2">
            List on Fundlevel
          </Link>
          {account ?
            <AccountDropdown account={account} /> :
            <Link href={redirects.auth.login}>
              <Button>Login</Button>
            </Link>
          }
          <ModeToggle variant="outline" />
        </div>
      </div>
      {/* <ExploreSearch className="hidden md:block max-w-lg mx-auto" /> */}
    </header>
  );
};