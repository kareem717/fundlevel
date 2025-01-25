"use client";

import { useAction } from "next-safe-action/hooks";
import { StripeIdentity } from "@repo/sdk";
import { useToast } from "@repo/ui/hooks/use-toast";
import { ToastAction } from "@repo/ui/components/toast";
import { Button } from "@repo/ui/components/button";
import { Loader2 } from "lucide-react";
import { usePathname, useRouter } from "next/navigation";
import { ComponentPropsWithoutRef } from "react";
import { cn } from "@repo/ui/lib/utils";
import { env } from "@/env";
import { getStripeIdentityUrlAction } from "@/actions/auth";

export interface IdentityCardProps extends ComponentPropsWithoutRef<"div"> {
  identity: StripeIdentity | null;
}
export function IdentityCard({ className, identity, ...props }: IdentityCardProps) {
  const currentUrl = env.NEXT_PUBLIC_APP_URL + usePathname()
  const { toast } = useToast()
  const router = useRouter()

  const { execute, isExecuting } = useAction(getStripeIdentityUrlAction, {
    onSuccess: ({ data }) => {
      if (data) {
        router.push(data)
      } else {
        toast({
          title: "Uh oh!",
          description: "Failed to get Stripe identity verification session URL",
          variant: "destructive",
          action: (
            <ToastAction
              altText="Retry"
              onClick={() => execute(currentUrl)}
            >
              Retry
            </ToastAction>
          )
        })
      }
    },
    onError: ({ error }) => {
      console.error("error", error)
      toast({
        title: "Uh oh!",
        description: "Failed to get Stripe identity verification session URL",
        variant: "destructive",
        action: (
          <ToastAction
            altText="Retry"
            onClick={() => execute(currentUrl)}
          >
            Retry
          </ToastAction>
        )
      })
    }
  })

  return (
    <div className={cn("flex flex-col gap-2", className)} {...props}>
      {identity ? (
        <div>
          <p>Identity: {identity.remote_id}</p>
          <p>Status: {identity.status}</p>
        </div>
      ) : (
        <Button onClick={() => execute(currentUrl)} disabled={isExecuting}>
          {isExecuting && <Loader2 className="w-4 h-4 animate-spin" />}
          Verify your identity
        </Button>
      )}
    </div>
  );
}

