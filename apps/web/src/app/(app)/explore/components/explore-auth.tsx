"use client"

import { ComponentPropsWithoutRef, FC, useEffect, useState, memo } from "react"
import { Account } from "@/lib/api";
import { cn } from "@/lib/utils";
import { AccountDropdown } from "@/components/ui/account-dropdown";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import redirects from "@/lib/config/redirects";
import { useAction } from "next-safe-action/hooks";
import { getAccount } from "@/actions/auth";

export interface ExploreAuthProps extends ComponentPropsWithoutRef<"div"> { };

export const ExploreAuth: FC<ExploreAuthProps> = memo(({ className, ...props }) => {
  const [account, setAccount] = useState<Account | undefined>(undefined);

  const { execute } = useAction(getAccount, {
    onSuccess: ({ data }) => {
      setAccount(data);
    },
    onError: (error) => {
      console.error(error);
    }
  })

  useEffect(() => {
    execute();
  }, []);

  return (
    <div className={cn("flex items-center justify-center gap-2", className)} {...props}>
      {account ?
        <AccountDropdown account={account} /> :
        <Link href={redirects.auth.login}>
          <Button>Login</Button>
        </Link>
      }
    </div>
  );
});