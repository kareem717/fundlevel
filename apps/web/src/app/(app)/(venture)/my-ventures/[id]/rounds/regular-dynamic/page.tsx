"use client"

import { getVentureRegularDynamicRoundsCursor } from "@/actions/ventures";
import { Icons } from "@/components/icons";
import { RegularDynamicRound, } from "@/lib/api";
import { useAction } from "next-safe-action/hooks";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { useInView } from "react-intersection-observer";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

export default function VentureRegularDynamicRoundsPage({ params }: { params: { id: string } }) {
  const [data, setData] = useState<RegularDynamicRound[]>([])
  const [cursor, setCursor] = useState<number>(1)
  const [hasMore, setHasMore] = useState(true)
  const [ref, inView] = useInView({
    threshold: 1,
  })

  const { executeAsync, isExecuting } = useAction(getVentureRegularDynamicRoundsCursor, {
    onSuccess: ({ data }) => {
      const newData = data?.regularDynamicRounds ?? []
      setData((prevData) => [...prevData, ...newData])
      if (data?.nextCursor) {
        setCursor(data.nextCursor) // Update cursor for next fetch
      } else {
        setHasMore(false) // Set cursor to null if no more data
      }
    },
    onError: (error) => {
      toast.error("Error fetching fixed total rounds")
      console.error("Error fetching fixed total rounds:", error)
    }
  })

  const loadMore = async () => {
    try {
      await executeAsync({ cursor, parentId: parseInt(params.id), limit: 10 })
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
    <div className="p-4 space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {data.map((item, index) => (
          <Card key={index} className="aspect-square">
            <CardHeader>
              <CardTitle>{item.round.status}</CardTitle>
            </CardHeader>
            <CardContent>
              {JSON.stringify(item)}
            </CardContent>
          </Card>
        ))}
      </div>
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
  )
}