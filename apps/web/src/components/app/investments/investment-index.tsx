"use client"

import { ComponentPropsWithoutRef, FC, useEffect, useState } from "react"
import { EmptySectionCard } from "@/components/app/empty-section-card"
import { cn } from "@/lib/utils"
import { useAction } from "next-safe-action/hooks"
import { toast } from "sonner"
import { useInView } from "react-intersection-observer"
import { Icons } from "@/components/icons"
import { InvestmentIndexCard } from "./investment-index-card"
import { RoundInvestment } from "@/lib/api"
import { getAccountReceivedRoundInvestmentsCursor, getAccountRoundInvestmentsCursor } from "@/actions/investments"

export interface InvestmentIndexProps extends ComponentPropsWithoutRef<"div"> {
  type: "recieved" | "sent"
};

export const InvestmentIndex: FC<InvestmentIndexProps> = ({ type, className, ...props }) => {
  const [data, setData] = useState<RoundInvestment[]>([])
  const [cursor, setCursor] = useState<number>(1)
  const [hasMore, setHasMore] = useState(true)
  const [ref, inView] = useInView({
    threshold: 1,
  })

  const func = type ===
    "recieved" ? getAccountReceivedRoundInvestmentsCursor : getAccountRoundInvestmentsCursor
    
  const { executeAsync, isExecuting } = useAction(func, {
    onSuccess: ({ data }) => {
      const newData = data?.investments ?? []
      setData((prevData) => [...prevData, ...newData])
      if (data?.nextCursor) {
        setCursor(data.nextCursor) // Update cursor for next fetch
      } else {
        setHasMore(false) // Set cursor to null if no more data
      }
    },
    onError: (error) => {
      toast.error("Error fetching dutch dynamic rounds")
      console.error("Error fetching dutch dynamic rounds:", error)
    }
  })

  const loadMore = async () => {
    try {
      await executeAsync({ cursor, limit: 10 })
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
    <div className={cn("p-4 w-full", className)} {...props}>
      {!hasMore && data.length === 0 ? (
        <EmptySectionCard
          id={`active-rounds-index`}
          title="No active rounds"
          description="None of your rounds are active yet."
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
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 w-full mx-auto overflow-y-auto">
          {data.map((investment) => (
            <InvestmentIndexCard key={investment.id} investment={investment} className="w-full aspect-square" />
          ))}
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

      )}

    </div>
  )
};