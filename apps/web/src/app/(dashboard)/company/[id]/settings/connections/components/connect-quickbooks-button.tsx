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
import { QuickBooksIcon } from "@fundlevel/web/components/icons";

interface ConnectQuickBooksButtonProps
  extends ComponentPropsWithoutRef<typeof Button> {
  companyId: number;
}

export function ConnectQuickBooksButton({
  className,
  companyId,
  ...props
}: ConnectQuickBooksButtonProps) {
  const router = useRouter();
  const { authToken } = useAuth();
  if (!authToken) {
    throw new Error("ConnectQuickBooksButton: No bearer token found");
  }

  const { mutate, isPending } = useMutation({
    mutationFn: async () => {
      const resp = await client(
        env.NEXT_PUBLIC_BACKEND_URL,
        authToken,
      ).company.quickbooks.connect.$post({
        json: {
          companyId,
          redirectUrl:
            env.NEXT_PUBLIC_WEB_URL +
            redirects.app.company(companyId).settings.connections,
        },
      });
      if (resp.status !== 200) {
        throw new Error(
          `ConnectQuickBooksButton: Failed to connect QuickBooks, status: ${resp.status}`,
        );
      }

      return await resp.json();
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
      className={cn(className, isPending && "animate-pulse")}
      onClick={() => mutate()}
      {...props}
    >
      <QuickBooksIcon className="size-25" />
    </Button>
  );
}
