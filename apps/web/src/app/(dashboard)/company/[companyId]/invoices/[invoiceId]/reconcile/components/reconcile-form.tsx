"use client";

import type { ComponentPropsWithoutRef } from "react";
import { useMutation } from "@tanstack/react-query";
import { client } from "@fundlevel/sdk";
import { env } from "@fundlevel/web/env";
import { cn } from "@fundlevel/ui/lib/utils";
import { Button } from "@fundlevel/ui/components/button";
import { toast } from "@fundlevel/ui/components/sonner";
import { getTokenCached } from "@fundlevel/web/actions/auth";
import { Card } from "@fundlevel/ui/components/card";

interface ReconcileFormProps
  extends ComponentPropsWithoutRef<"div"> {
  invoiceId: number;
  onReconcileSuccess: (data: { taskId: string, publicAccessToken: string }) => void;
}

export function ReconcileForm({
  invoiceId,
  onReconcileSuccess,
  className,
  ...props
}: ReconcileFormProps) {
  const { mutate: reconcileInvoice, isPending } = useMutation({
    mutationKey: ["reconcile-invoice", invoiceId],
    mutationFn: async () => {
      const token = await getTokenCached();
      if (!token) {
        throw new Error("No token")
      }

      const resp = await client(env.NEXT_PUBLIC_BACKEND_URL, token).invoice[":invoiceId"].reconcile.$post({
        param: { invoiceId },
      });

      const respBody = await resp.json()
      if ("error" in respBody) {
        return toast.error("Uh oh!", {
          description: respBody.error
        })
      }

      toast.info("Started!", {
        description: "Reconciliation process initiated successfully"
      })

      onReconcileSuccess(respBody);
    },
  });

  return (
    <Card className={cn("border border-dashed p-6", className)} {...props}>
      <div className="flex flex-col sm:flex-row items-center gap-4 justify-between">
        <div className="space-y-1">
          <h3 className="text-lg font-medium">Invoice Reconciliation</h3>
          <p className="text-sm text-muted-foreground">Match this invoice with banking transactions</p>
        </div>
        <Button
          type="button"
          onClick={() => reconcileInvoice()}
          disabled={isPending}
          className="bg-primary text-primary-foreground hover:bg-primary/90 px-6"
          size="default"
        >
          {isPending ? "Processing..." : "Reconcile Invoice"}
        </Button>
      </div>
    </Card>
  );
} 