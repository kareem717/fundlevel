"use client";

import { Button } from "@fundlevel/ui/components/button";
import type { ComponentPropsWithoutRef } from "react";
import { toast } from "@fundlevel/ui/components/sonner";
import { cn } from "@fundlevel/ui/lib/utils";
import { Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useMutation } from "@tanstack/react-query";
import { client } from "@fundlevel/sdk";
import { useAuth } from "@fundlevel/web/components/providers/auth-provider";
import { redirects } from "@fundlevel/web/lib/config/redirects";
import { env } from "@fundlevel/web/env";

interface LinkQuickBooksButtonProps
  extends ComponentPropsWithoutRef<typeof Button> {
  companyId: number;
}

export function LinkQuickBooksButton({
  className,
  companyId,
  ...props
}: LinkQuickBooksButtonProps) {
  const router = useRouter();
  const { authToken } = useAuth()
  if (!authToken) {
    throw new Error("LinkQuickBooksButton: No bearer token found")
  }

  const { mutate, isPending } = useMutation({
    mutationFn: async () => {
      const resp = await client(env.NEXT_PUBLIC_BACKEND_URL, authToken).company.quickbooks.connect.$post({
        json: {
          companyId,
          redirectUrl: process.env.NEXT_PUBLIC_APP_URL + redirects.app.company(companyId).settings.connections,
        },
      })
      if (resp.status !== 200) {
        throw new Error("LinkQuickBooksButton: Failed to connect QuickBooks, status: " + resp.status)
      }

      return await resp.json()
    },
    onSuccess: async ({ url }) => {
      toast.info("Hold on tight, we're taking you to QuickBooks");
      router.push(url);
    },
    onError: () => {
      toast.error("Uh oh!", {
        description: "An error occurred, please try again.",
      });
    },
  });

  return (
    <Button
      className={cn(className)}
      onClick={() => mutate()}
      {...props}
    >
      {isPending && <Loader2 className="mr-2 animate-spin" />}
      Link QuickBooks
    </Button>
  );
}
