"use client";

import type { ComponentPropsWithoutRef } from "react";
import { useRealtimeRun } from "@trigger.dev/react-hooks";
import { cn } from "@fundlevel/ui/lib/utils";
import { Skeleton } from "@fundlevel/ui/components/skeleton";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@fundlevel/ui/components/card";
import { Badge } from "@fundlevel/ui/components/badge";
import { Separator } from "@fundlevel/ui/components/separator";
import { SuggestedTransactionCard } from "./suggested-transaction-card";
import { Loader2, CircleX, AlertCircle } from "lucide-react";

interface DisplayReconciliationProps
  extends ComponentPropsWithoutRef<"div"> {
  taskId: string
  publicAccessToken: string
}

export function DisplayReconciliation({
  taskId,
  publicAccessToken,
  className,
  ...props
}: DisplayReconciliationProps) {
  const { run, error, stop } = useRealtimeRun(taskId, {
    accessToken: publicAccessToken,
  });

  if (!run) {
    return <Card className="p-6"><Skeleton className="h-12 w-full" /></Card>
  }

  const { output, status, id, ...rest } = run

  if (error) {
    return (
      <Card className="p-6 border-red-200 bg-red-50">
        <div className="text-red-600">Error: {error.message}</div>
      </Card>
    );
  }
  console.log(output)
  return (
    <Card className={cn("", className)} {...props}>
      <CardHeader className="pb-2">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <CardTitle className="text-xl">Reconciliation Results</CardTitle>
            <CardDescription>Processing invoice transactions</CardDescription>
          </div>
          <Badge variant={status === "COMPLETED" ? "default" : status === "EXECUTING" ? "outline" : "secondary"}>
            {status}
          </Badge>
        </div>
      </CardHeader>
      <Separator />
      <CardContent className="pt-6">
        <div className="grid gap-4">
          {status === "COMPLETED" ? (
            <>
              {output?.result?.suggestedTransactions && output.result.suggestedTransactions.length > 0 && (
                <div className="flex flex-col gap-2">
                  <p className="text-muted-foreground">Suggested transactions</p>
                  <div className="grid gap-2">
                    {output.result.suggestedTransactions.map((r: any) => (
                      <SuggestedTransactionCard
                        key={r.transactionId}
                        transactionId={r.transactionId}
                        confidence={r.confidence}
                        matchReason={r.matchReason}
                      />
                    ))}
                  </div>
                </div>
              )}
              {(!output?.result?.suggestedTransactions || output.result.suggestedTransactions.length === 0) &&
                (!output?.result?.evaluatedTransactions || output.result.evaluatedTransactions.length === 0) && (
                  <div className="text-center p-6 bg-muted rounded-md">
                    <p className="text-muted-foreground">No matching transactions found</p>
                  </div>
                )}
            </>
          ) : (
            <div className="text-center p-6 bg-muted rounded-md flex justify-center items-center gap-2">
              {status === "QUEUED" && (
                <>
                  <Loader2 className="animate-spin text-muted-foreground size-4" />
                  <p className="text-muted-foreground">Getting ready...</p>
                </>
              )}
              {status === "EXECUTING" && (
                <>
                  <Loader2 className="animate-spin text-muted-foreground size-4" />
                  <p className="text-muted-foreground">Processing...</p>
                </>
              )}
              {status === "FAILED" && (
                <>
                  <AlertCircle className="text-muted-foreground size-4" />
                  <p className="text-muted-foreground">Something went wrong</p>
                </>
              )}
              {status === "CANCELED" && (
                <>
                  <CircleX className="text-muted-foreground size-4" />
                  <p className="text-muted-foreground">Cancelled</p>
                </>
              )}
              {status !== "QUEUED" && status !== "EXECUTING" && status !== "FAILED" && status !== "CANCELED" && (
                <>
                  <CircleX className="text-muted-foreground size-4" />
                  <p className="text-muted-foreground">Unknown status</p>
                </>
              )}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
} 