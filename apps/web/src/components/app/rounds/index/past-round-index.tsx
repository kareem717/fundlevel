"use client"

import { ComponentPropsWithoutRef, FC, useEffect, useState } from "react"
import { Label } from "@/components/ui/label"
import { EmptySectionCard } from "@/components/app/empty-section-card"
import { cn } from "@/lib/utils"
import { useAction } from "next-safe-action/hooks"
import { RoundWithSubtypes } from "@/lib/api"
import { getAccountRounds } from "@/actions/rounds"
import { toast } from "sonner"
import { useInView } from "react-intersection-observer"
import { Icons } from "@/components/icons"
import { Card, CardContent } from "@/components/ui/card"
import { RoundIndexCard } from "../index-card"

export interface PastRoundIndexProps extends ComponentPropsWithoutRef<"div"> {

};

export const PastRoundIndex: FC<PastRoundIndexProps> = ({ className, ...props }) => {
  const [rounds, setRounds] = useState<RoundWithSubtypes[]>([])
  const [cursor, setCursor] = useState(1)
  const [hasMore, setHasMore] = useState(true)

  const { executeAsync, isExecuting } = useAction(getAccountRounds, {
    onSuccess: ({ data }) => {
      const newData = data?.roundsWithSubtypes ?? []
      setRounds((prevData) => [...prevData, ...newData])
      if (data?.nextCursor) {
        setCursor(data.nextCursor) // Update cursor for next fetch
      } else {
        setHasMore(false) // Set cursor to null if no more data
      }
    },
    onError: (error) => {
      toast.error("Error fetching partial total rounds")
      console.error("Error fetching partial total rounds:", error)
    }
  })

  const [ref, inView] = useInView({
    threshold: 1,
  })

  const loadMore = async () => {
    try {
      await executeAsync({
        paginationRequestSchema: { cursor, limit: 10 },
        status: ["successful", "failed"]
      })
    } catch (error) {
      console.error('Error fetching more data:', error)
    }
  }

  useEffect(() => {
    if (inView && !isExecuting) {
      loadMore()
    }
  }, [inView])

  return (
    <div className={cn("flex flex-col gap-2 w-full", className)} {...props}>
      {rounds.length > 1 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {rounds.map((round) => (
            <RoundIndexCard key={round.id} round={round} />
          ))}
        </div>
      ) : (
        <EmptySectionCard
          id={`active-rounds-index`}
          title="No past rounds"
          description="You don't have any rounds that finished."
          button={{
            label: "Upgrade",
            href: "/rounds/create",
          }}
          icon="chart"
          image={{
            src: "/filler.jpeg",
            alt: "No active rounds",
          }}
        />
      )}
      {hasMore ? (
        <div ref={ref} className="h-10 flex items-center justify-center">
          {isExecuting && <Icons.spinner className="h-6 w-6 animate-spin" />}
        </div>
      ) : (
        <div className="h-10 flex items-center justify-center">
          <p>No more data</p>
        </div>
      )}
    </div>
  );
};