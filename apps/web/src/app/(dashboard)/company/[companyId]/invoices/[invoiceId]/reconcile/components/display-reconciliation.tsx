"use client";

import type { ComponentPropsWithoutRef } from "react";
import { useRealtimeRun } from "@trigger.dev/react-hooks";
import { cn } from "@fundlevel/ui/lib/utils";
import { Skeleton } from "@fundlevel/ui/components/skeleton";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@fundlevel/ui/components/card";
import { Badge } from "@fundlevel/ui/components/badge";
import { Separator } from "@fundlevel/ui/components/separator";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@fundlevel/ui/components/accordion";
import { TransactionCard } from "./transaction-card";

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

  return (
    <Card className={cn("", className)} {...props}>
      <CardHeader className="pb-2">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <CardTitle className="text-xl">Reconciliation Results</CardTitle>
            <CardDescription>Processing invoice transactions</CardDescription>
          </div>
          <div className="flex items-center gap-2">
            <Badge variant={status === "COMPLETED" ? "default" : status === "EXECUTING" ? "outline" : "secondary"}>
              {status}
            </Badge>
            <Badge variant="outline" className="text-xs">
              Run: {id.substring(0, 10)}...
            </Badge>
          </div>
        </div>
      </CardHeader>
      <Separator />
      <CardContent className="pt-6">
        <div className="grid gap-4">
          {output?.result && output.result.length > 0 ? (
            output.result.map((r: any) => (
              <TransactionCard
                key={r.transactionId}
                transactionId={r.transactionId}
                confidence={r.confidence}
                matchReason={r.matchReason}
              />
            ))
          ) : (
            <div className="text-center p-6 bg-muted rounded-md">
              <p className="text-muted-foreground">No matching transactions found</p>
            </div>
          )}
        </div>
      </CardContent>
      <CardFooter className="pt-0">
        <Accordion type="single" collapsible className="w-full">
          <AccordionItem value="metadata" className="border-0">
            <AccordionTrigger className="text-sm">Run Metadata</AccordionTrigger>
            <AccordionContent>
              <div className="text-xs mt-2 p-3 bg-muted rounded-md overflow-x-auto">
                <pre className="whitespace-pre-wrap break-words">
                  {JSON.stringify(rest, null, 2)}
                </pre>
              </div>
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </CardFooter>
    </Card>
  );
} 