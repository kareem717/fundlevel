"use client"

import { ComponentPropsWithoutRef, FC, useEffect, useState } from "react"
import {
  SelectContent,
  SelectItem,
} from "@/components/ui/select"
import { useAuth } from "@/components/providers/auth-provider";
import { Venture } from "@/lib/api";
import { useAction } from "next-safe-action/hooks";
import { toast } from "sonner";
import { Icons } from "@/components/icons";
import { useInView } from "react-intersection-observer";
import { getAccountVentures } from "@/actions/ventures";
export interface VentureSelectItemsProps extends ComponentPropsWithoutRef<typeof SelectContent> {
};

export const VentureSelectItems: FC<VentureSelectItemsProps> = ({ className, ...props }) => {
  const [ventures, setVentures] = useState<Venture[]>([])
  const [cursor, setCursor] = useState<number | null>(1)
  const [hasMore, setHasMore] = useState(true)


  const { execute, isExecuting } = useAction(getAccountVentures, {
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
      execute({ cursor, limit: 10 })
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