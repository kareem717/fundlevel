"use client";

import type { ComponentPropsWithoutRef } from "react";
import { useMutation } from "@tanstack/react-query";
import { client } from "@fundlevel/sdk";
import { env } from "@fundlevel/web/env";
import { useAuth } from "@fundlevel/web/components/providers/auth-provider";
import { cn } from "@fundlevel/ui/lib/utils";
import { Button } from "@fundlevel/ui/components/button";

export interface ReconcilationClientProps
  extends ComponentPropsWithoutRef<"div"> {
  invoiceId: number;
}

export function ReconcilationClient({
  invoiceId,
  className,
  ...props
}: ReconcilationClientProps) {
  const { authToken } = useAuth();
  if (!authToken) {
    throw new Error("Component must be used within a <AuthProvider>");
  }
  const sdk = client(env.NEXT_PUBLIC_BACKEND_URL, authToken);

  const { mutate: reconcileInvoice, isPending } = useMutation({
    mutationKey: ["reconcile-invoice", invoiceId],
    mutationFn: async () => {
      return sdk.invoice[":invoiceId"].reconcile.$post({
        param: { invoiceId },
      });
    },
  });

  return (
    <div className={cn("space-y-4", className)} {...props}>
      <Button
        type="button"
        onClick={() => reconcileInvoice()}
        disabled={isPending}
        className="bg-primary text-primary-foreground hover:bg-primary/90 px-4 py-2 rounded-md"
      >
        {isPending ? "Reconciling..." : "Reconcile Invoice"}
      </Button>
    </div>
  );
}
