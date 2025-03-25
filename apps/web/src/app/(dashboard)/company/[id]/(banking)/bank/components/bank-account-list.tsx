"use client";

import { redirects } from "@fundlevel/web/lib/config/redirects";
import { getTokenCached } from "@fundlevel/web/actions/auth";
import { redirect } from "next/navigation";
import { client } from "@fundlevel/sdk";
import { env } from "@fundlevel/web/env";
import { BankAccountCard } from "./bank-account-card";
import { useQuery } from "@tanstack/react-query";
import { Skeleton } from "@fundlevel/ui/components/skeleton";

export function BankAccountList({ companyId }: { companyId: number }) {
  const { data: bankAccounts, isPending } = useQuery({
    queryKey: ["bank-accounts", companyId],
    queryFn: async () => {
      const token = await getTokenCached();
      if (!token) {
        return redirect(redirects.auth.login);
      }

      const req = await client(env.NEXT_PUBLIC_BACKEND_URL, token).accounting[
        "bank-accounts"
      ].company[":companyId"].$get({ param: { companyId } });
      if (!req.ok) {
        throw new Error("Failed to fetch bank accounts");
      }

      return await req.json();
    },
    // staleTime: 1000 * 60 * 5,
  });

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 w-full">
      {isPending ? (
        Array.from({ length: 9 }).map((_, index) => (
          <Skeleton key={index} className="h-96 w-full" />
        ))
      ) : bankAccounts && bankAccounts.length > 0 ? (
        bankAccounts.map((account) => {
          const inFundlevel = Math.random() * 1000;
          const unReconciled = Math.random() * 1000;
          const totalTransactionVolume = inFundlevel + unReconciled;

          return (
            <BankAccountCard
              key={account.remoteId}
              account={{
                ...account,
                inFundlevel,
                unReconciled,
                totalTransactionVolume,
              }}
            />
          );
        })
      ) : (
        <p className="text-muted-foreground">No bank accounts found</p>
      )}
    </div>
  );
}
