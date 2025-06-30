"use client";

import type { ComponentPropsWithoutRef } from "react";
import { cn } from "@fundlevel/ui/lib/utils";
import { parseAsString, useQueryStates } from "nuqs";
import { ReconcileForm } from "./reconcile-form";
import { DisplayReconciliation } from "./display-reconciliation";

export interface ReconcileClientProps extends ComponentPropsWithoutRef<"div"> {
  invoiceId: number;
}

export function ReconcileClient({
  invoiceId,
  className,
  ...props
}: ReconcileClientProps) {
  const [{ taskId, publicAccessToken }, setTask] = useQueryStates(
    {
      taskId: parseAsString.withOptions({ history: "push" }).withDefault(""),
      publicAccessToken: parseAsString
        .withOptions({ history: "push" })
        .withDefault(""),
    },
    {
      urlKeys: {
        taskId: "t",
        publicAccessToken: "a",
      },
    },
  );

  return (
    <div className={cn("space-y-6", className)} {...props}>
      <ReconcileForm invoiceId={invoiceId} onReconcileSuccess={setTask} />

      {taskId && publicAccessToken && (
        <DisplayReconciliation
          taskId={taskId}
          publicAccessToken={publicAccessToken}
          invoiceId={invoiceId}
        />
      )}
    </div>
  );
}
