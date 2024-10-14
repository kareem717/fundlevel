"use client"

import { ComponentPropsWithoutRef, FC, useEffect, useState } from "react"
import {
  SelectContent,
  SelectItem,
} from "@/components/ui/select"
import { Venture } from "@/lib/api";
import { useAction } from "next-safe-action/hooks";
import { toast } from "sonner";
import { Icons } from "@/components/ui/icons";
import { useInView } from "react-intersection-observer";
import { getBusinessVenturesInfinite } from "@/actions/busineses";
export interface VentureSelectItemsProps extends ComponentPropsWithoutRef<typeof SelectContent> {
  businessId: number
};

export const VentureSelectItems: FC<VentureSelectItemsProps> = ({ businessId, className, ...props }) => {
  const [ventures, setVentures] = useState<Venture[]>([])
  const [cursor, setCursor] = useState<number | null>(1)
  const [hasMore, setHasMore] = useState(true)


  const { execute, isExecuting } = useAction(getBusinessVenturesInfinite, {
    onSuccess: ({ data }) => {
      const newData = data?.ventures ?? []
      console.log("newData", newData)
      setVentures((prevData) => [...prevData, ...newData])
      if (data?.nextCursor) {
        setCursor(data.nextCursor) // Update cursor for next fetch
      } else {
        setHasMore(false) // Set cursor to null if no more data
      }
    },
    onError: ({ error }) => {
      toast.error("Something went wrong", {
        description: "An error occurred while fetching ventures",
      })
    }
  })

  const [ref, inView] = useInView({
    threshold: 0,
  })

  useEffect(() => {
    if (cursor && inView && !isExecuting) {
      execute({ businessId, pagination: { cursor, limit: 10 } })
    }
  }, [inView])

  return (
    <SelectContent className={className} {...props}>
      {ventures.map((venture, index) => ((
        <SelectItem key={index} value={venture.id.toString()}>{venture.name}</SelectItem>
      )))}
      {hasMore && <div ref={ref} className="h-10 flex items-center justify-center">
        {isExecuting && <Icons.spinner className="h-4 w-4 animate-spin" />}
      </div>}
    </SelectContent>
  );
};