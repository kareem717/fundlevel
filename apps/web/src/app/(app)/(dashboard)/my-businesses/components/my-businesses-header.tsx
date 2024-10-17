import { AccountDropdown } from "@/components/ui/account-dropdown";
import { LogoDiv, SmallLogoDiv } from "@/components/ui/logo-div"
import { ModeToggle } from "@/components/ui/mode-toggle";
import { Account } from "@/lib/api";
import { cn } from "@/lib/utils";
import { ComponentPropsWithoutRef, FC } from "react"

export interface MyBusinessesHeaderProps extends ComponentPropsWithoutRef<"header"> {
  account: Account
};

export const MyBusinessesHeader: FC<MyBusinessesHeaderProps> = ({ className, account, ...props }) => {
  return (
    <header {...props} className={cn("flex items-center justify-between p-4", className)}>
      <LogoDiv className="hidden md:block" />
      <SmallLogoDiv className="md:hidden" />
      <div className="flex items-center gap-2">
        <AccountDropdown account={account} />
        <ModeToggle variant="outline" />
      </div>
    </header>
  );
};