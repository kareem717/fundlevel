"use client"

import { getVentureActiveRound } from "@/actions/ventures";
import { buttonVariants } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton";
import { Round } from "@/lib/api";
import redirects from "@/lib/config/redirects";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { useAction } from "next-safe-action/hooks";
import { ComponentPropsWithoutRef, FC, useEffect, useState } from "react"
import { toast } from "sonner";

export interface VentureActiveRoundCardProps extends ComponentPropsWithoutRef<"div"> {
  ventureId: number;
};

export const VentureActiveRoundCard: FC<VentureActiveRoundCardProps> = ({ ventureId, className, ...props }) => {
  const [round, setRound] = useState<Round | null>(null);

  const { execute, isExecuting } = useAction(getVentureActiveRound, {
    onSuccess: ({ data }) => {
      setRound(data?.round ?? null);
    },
    onError: (error) => {
      console.error(error);
      toast.error("Failed to fetch active round");
    },
  });

  useEffect(() => {
    execute(ventureId);
  }, [execute, ventureId]);

  if (isExecuting) {
    return <Skeleton className={cn("w-96 aspect-square", className)} />;
  }

  if (!round) {
    return null;
  }

  return (
    <Card {...props} className={cn("w-full h-full", className)}>
      <CardHeader>
        <CardTitle>Currently Raising</CardTitle>
        <CardDescription>
          This venture currently has a active round.
        </CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col gap-2">
        <span className="font-semibold">
          Valuation: {round.percentageValue / (round.percentageOffered / 100)}
        </span>
        <span className="font-semibold">
          Offered: {round.percentageOffered}%
        </span>
        <span className="font-semibold">
          Investors: {round.investorCount}
        </span>
      </CardContent>
      <CardFooter>
        <Link
          href={redirects.app.explore.roundView.replace(":id", round?.id.toString() ?? "0")}
          className={cn("w-full", buttonVariants({ variant: "outline" }))}
        >
          View Round
        </Link>
      </CardFooter>
    </Card>
  );
};