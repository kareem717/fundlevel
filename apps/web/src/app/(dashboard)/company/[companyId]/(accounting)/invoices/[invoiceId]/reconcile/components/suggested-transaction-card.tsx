"use client";

import type { ComponentPropsWithoutRef } from "react";
import { useMutation, useQuery } from "@tanstack/react-query";
import { client } from "@fundlevel/sdk";
import { env } from "@fundlevel/web/env";
import { cn } from "@fundlevel/ui/lib/utils";
import { getTokenCached } from "@fundlevel/web/actions/auth";
import { Skeleton } from "@fundlevel/ui/components/skeleton";
import { Calendar, CreditCard, DollarSign, Info, Loader2 } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@fundlevel/ui/components/card";
import { Badge } from "@fundlevel/ui/components/badge";
import { Button } from "@fundlevel/ui/components/button";
import { toast } from "@fundlevel/ui/components/sonner";

interface SuggestedTransactionCardProps
  extends ComponentPropsWithoutRef<"div"> {
  transactionId: number;
  invoiceId: number;
  confidence: "low" | "medium" | "high";
  matchReason: string;
}

export function SuggestedTransactionCard({
  transactionId,
  invoiceId,
  confidence,
  matchReason,
  className,
  ...props
}: SuggestedTransactionCardProps) {
  const { data, isPending } = useQuery({
    queryKey: ["transaction", transactionId],
    queryFn: async () => {
      const token = await getTokenCached();
      if (!token) {
        throw new Error("No token");
      }

      const resp = await client(env.NEXT_PUBLIC_BACKEND_URL, token)[
        "bank-transaction"
      ][":id"].$get({
        param: {
          id: transactionId,
        },
      });

      const respBody = await resp.json();
      if ("error" in respBody) {
        throw new Error(respBody.error);
      }

      return respBody;
    },
  });

  const { mutateAsync: createRelationship, isPending: isCreatingRelationship } =
    useMutation({
      mutationFn: async () => {
        const token = await getTokenCached();
        if (!token) {
          throw new Error("No token");
        }

        const resp = await client(env.NEXT_PUBLIC_BACKEND_URL, token)[
          "bank-transaction"
        ][":id"].relationships.$post({
          param: {
            id: transactionId,
          },
          json: {
            entityId: invoiceId,
            entityType: "invoice",
          },
        });

        if (!resp.ok) {
          const body = await resp.json();
          console.error(body);
          toast.error("Failed to create relationship");
        }

        return await resp.json();
      },
      onSuccess: () => {
        toast.success("Relationship created");
      },
      onError: () => {
        toast.error("Failed to create relationship");
      },
    });

  if (isPending) {
    return <Skeleton className="w-full h-32" />;
  }

  //TODO: Handle error
  if (!data) {
    return null;
  }

  const confidenceColor = {
    low: "bg-amber-100 text-amber-800 hover:bg-amber-200",
    medium: "bg-blue-100 text-blue-800 hover:bg-blue-200",
    high: "bg-green-100 text-green-800 hover:bg-green-200",
  }[confidence ?? "low"];

  return (
    <Card className={cn("mb-4 overflow-hidden", className)} {...props}>
      <CardHeader className="pb-2">
        <div className="flex items-start justify-between">
          <div>
            <CardTitle className="text-lg font-medium">{data.name}</CardTitle>
            <CardDescription className="text-sm text-muted-foreground">
              {data.date}
            </CardDescription>
          </div>
          <div className="flex items-center gap-2">
            {confidence && (
              <Badge className={confidenceColor}>
                {confidence.charAt(0).toUpperCase() + confidence.slice(1)}{" "}
                Confidence
              </Badge>
            )}
            <Button
              size="sm"
              onClick={() => createRelationship()}
              disabled={isCreatingRelationship}
            >
              {isCreatingRelationship && (
                <Loader2 className="animate-spin text-muted-foreground size-4" />
              )}
              Pair to invoice
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="flex items-center gap-4 mb-3">
          <div className="flex items-center gap-2">
            <DollarSign className="h-4 w-4 text-muted-foreground" />
            <span
              className={cn(
                "font-medium",
                data.amount > 0 ? "text-red-600" : "text-green-600",
              )}
            >
              {Math.abs(data.amount)} {data.isoCurrencyCode}
              <span className="ml-1 text-xs font-normal">
                {data.amount > 0 ? "(Debit)" : "(Credit)"}
              </span>
            </span>
          </div>
          <div className="flex items-center gap-2">
            <CreditCard className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm text-muted-foreground">
              {data.paymentChannel}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <Calendar className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm text-muted-foreground">{data.date}</span>
          </div>
        </div>
        <div className="bg-muted p-3 rounded-md mb-3 flex gap-2 items-start">
          <Info className="h-4 w-4 text-muted-foreground mt-0.5" />
          <p className="text-sm">{matchReason}</p>
        </div>
      </CardContent>
    </Card>
  );
}
