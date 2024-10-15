"use client"

import { ComponentPropsWithoutRef, FC, useEffect, useState } from "react"
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { PatternBackground } from "@/components/app/pattern-background";
import { timeSince, cn } from "@/lib/utils";
import { FixedTotalRound, RoundWithSubtypes } from "@/lib/api";
import redirects from "@/lib/config/redirects";
import Link from "next/link";
import { ScrollArea } from "@/components/ui/scroll-area";
import { getFixedTotalRoundsInfinite } from "@/actions/rounds";
import { useAction } from "next-safe-action/hooks";
import { toast } from "sonner";
import { useInView } from "react-intersection-observer";
import { Icons } from "@/components/ui/icons";

export interface RoundIndexCardProps extends ComponentPropsWithoutRef<"div"> {
  round: FixedTotalRound
};

export const RoundIndexCard: FC<RoundIndexCardProps> = ({ round, className, ...props }) => {
  const { createdAt, round: { id } } = round

  return (
    <Link href={redirects.app.rounds.view.replace(":id", id.toString())}>
      <Card className={cn("w-full", className)}>
        <PatternBackground hash={createdAt.toString()} />
        <CardHeader className="flex flex-row items-center justify-between">
          <h3 className="text-lg font-semibold">{id}</h3>
        </CardHeader>
        <CardContent>
          <span className="text-xs text-muted-foreground">
            Created {timeSince(createdAt)}
          </span>
        </CardContent>
      </Card>
    </Link>
  );
};

export interface RoundIndexProps extends ComponentPropsWithoutRef<"div"> {
};

export const RoundIndex: FC<RoundIndexProps> = ({ ...props }) => {
  const [rounds, setRounds] = useState<(FixedTotalRound)[]>([])
  const [cursor, setCursor] = useState<number>(1)
  const [hasMore, setHasMore] = useState(true)

  const { execute, isExecuting } = useAction(getFixedTotalRoundsInfinite, {
    onSuccess: ({ data }) => {
      setRounds((prev) => [...prev, ...(data?.fixedTotalRounds || [])])
      setHasMore(data?.hasMore || false)

      if (data?.nextCursor) {
        setCursor(data.nextCursor)
      }
    },
    onError: ({ error }) => {
      toast.error("Something went wrong", {
        description: "An error occurred while fetching rounds",
      })
    }
  })

  const [ref, inView] = useInView({
    threshold: 0,
  })

  useEffect(() => {
    if (cursor && inView && !isExecuting) {
      execute({ cursor, limit: 10 })
    }
  }, [inView])

  return (
    <div className="w-full h-full">
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-4 py-16 md:py-20">
        <ScrollArea className="w-full h-full flex flex-col justify-between">
          {rounds.map((round) => (
            <RoundIndexCard key={round.round.id} round={round} className="w-full" />
          ))}
        </ScrollArea>
      </div>
      {!isExecuting && rounds.length === 0 &&
        (
          <div className="w-full h-full flex items-start justify-center">
            <p className="text-muted-foreground">No rounds found.</p>
          </div>
        )
      }
      {hasMore && <div ref={ref} className="h-10 flex items-center justify-center">
        {isExecuting && <Icons.spinner className="h-4 w-4 animate-spin" />}
      </div>}
    </div>
  );
};