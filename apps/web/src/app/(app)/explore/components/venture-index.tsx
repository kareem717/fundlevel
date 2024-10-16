"use client"

import { ComponentPropsWithoutRef, FC, useEffect, useState } from "react"
import Link from "next/link";
import redirects from "@/lib/config/redirects";
import { timeSince, cn } from "@/lib/utils";
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { PatternBackground } from "@/components/app/pattern-background";
import { ScrollArea } from "@radix-ui/react-scroll-area";
import { Venture } from "@/lib/api";
import { useInView } from "react-intersection-observer";
import { useAction } from "next-safe-action/hooks";
import { getVenturesInfinite } from "@/actions/ventures";
import { toast } from "sonner";
import { Icons } from "@/components/ui/icons";

export interface VentureIndexCardProps extends ComponentPropsWithoutRef<"div"> {
  venture: Venture
};

export const VentureIndexCard: FC<VentureIndexCardProps> = ({ className, venture, ...props }) => {
  const { id, name, createdAt } = venture

  return (
    // TODO: Add a redirect to the venture page
    <Link href={redirects.app.ventures.view.replace(":id", id.toString())}>
      {/* <div className={cn("bg-card border shadow-sm rounded-md p-4 aspect-square h-full w-full flex flex-col justify-between items-start", className)}>
        <div className="text-lg font-bold">
          {name}
        </div>

      </div> */}
      <Card className="w-full h-full">
        {/* <PatternBackground hash={createdAt.toString()} /> */}
        {/* //TODO: make look better */}
        <div
          className={cn("h-12 w-full rounded-t-lg bg-primary", className)}
        />
        <CardHeader className="flex flex-row items-center justify-between">
          <h3 className="text-lg font-semibold">{name}</h3>
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

export interface VentureIndexProps extends ComponentPropsWithoutRef<"div"> {
};

export const VentureIndex: FC<VentureIndexProps> = ({ ...props }) => {
  const [ventures, setVentures] = useState<(Venture)[]>([])
  const [cursor, setCursor] = useState<number>(1)
  const [hasMore, setHasMore] = useState(true)

  const { execute, isExecuting } = useAction(getVenturesInfinite, {
    onSuccess: ({ data }) => {
      setVentures((prev) => [...prev, ...(data?.ventures || [])])
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
          {ventures.map((venture) => (
            <VentureIndexCard key={venture.id} venture={venture} className="w-full" />
          ))}
        </ScrollArea>
      </div>
      {!isExecuting && ventures.length === 0 &&
        (
          <div className="w-full h-full flex items-start justify-center">
            <p className="text-muted-foreground">No ventures found.</p>
          </div>
        )
      }
      {hasMore && <div ref={ref} className="h-10 flex items-center justify-center">
        {isExecuting && <Icons.spinner className="h-4 w-4 animate-spin" />}
      </div>}
    </div>
  );
};