"use client"

import { ComponentPropsWithoutRef, FC, memo, useEffect, useState } from "react"
import { useExploreNavbarStore } from "./use-explore-navbar"
import { useAction } from "next-safe-action/hooks"
import { getVenturesInfinite } from "@/actions/ventures"
import { getRoundsInfinite } from "@/actions/rounds"
import { Venture, Round } from "@/lib/api"
import { toast } from "sonner"
import { useInView } from "react-intersection-observer"
import { VentureIndexCard } from "./venture-index-card"
import { RoundIndexCard } from "./round-index-card"
import { Icons } from "@/components/ui/icons"

export interface ExploreIndexProps extends ComponentPropsWithoutRef<"div"> { };

export const ExploreIndex: FC<ExploreIndexProps> = memo(({ ...props }) => {
  const [ventureState, setVentureState] = useState({
    ventures: [] as Venture[],
    cursor: 1,
    hasMore: true,
  });

  const [roundState, setRoundState] = useState({
    rounds: [] as Round[],
    cursor: 1,
    hasMore: true,
  });

  const { execute: executeVentures, isExecuting: isVenturesExecuting } = useAction(getVenturesInfinite, {
    onSuccess: ({ data }) => {
      setVentureState((prevState) => ({
        ...prevState,
        ventures: [...prevState.ventures, ...(data?.ventures || [])],
        cursor: data?.nextCursor || 1,
        hasMore: data?.hasMore || false,
      }));
    },
    onError: () => {
      toast.error("Something went wrong", {
        description: "An error occurred while fetching ventures",
      })
    }
  })

  const { execute: executeRounds, isExecuting: isRoundsExecuting } = useAction(getRoundsInfinite, {
    onSuccess: ({ data }) => {
      setRoundState((prev) => ({
        ...prev,
        rounds: [...prev.rounds, ...(data?.rounds || [])],
        cursor: data?.nextCursor || 1,
        hasMore: data?.hasMore || false,
      }));
    },
    onError: () => {
      toast.error("Something went wrong", {
        description: "An error occurred while fetching rounds",
      })
    }
  })

  const { resource } = useExploreNavbarStore()

  const [ref, inView] = useInView({
    threshold: 0,
  })

  const isExecuting = resource === "Ventures" ? isVenturesExecuting : isRoundsExecuting

  useEffect(() => {
    if (inView) {
      if (resource === "Ventures") {
        if (!isVenturesExecuting && ventureState.hasMore) {
          executeVentures({ cursor: ventureState.cursor, limit: 10 })
        }
      } else {
        if (!isRoundsExecuting && roundState.hasMore) {
          executeRounds({ cursor: roundState.cursor, limit: 10 })
        }
      }
    }
  }, [inView, resource])

  const hasMore = resource === "Ventures" ? ventureState.hasMore : roundState.hasMore

  const content = resource === "Ventures" ? ventureState.ventures.map((venture, idx) => (
    <VentureIndexCard key={idx} venture={venture} className="w-full aspect-square" />
  )) : roundState.rounds.map((round, idx) => (
    <RoundIndexCard key={idx} round={round} className="w-full aspect-square" />
  ))

  return (
    <div {...props}>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 pt-16 md:pt-20">
        {content}
      </div>
      {hasMore ? (
        <div ref={ref} className="h-10 flex items-center justify-center">
          {isExecuting && <Icons.spinner className="h-4 w-4 animate-spin" />}
        </div>
      ) : (
        <div className="w-full flex items-start justify-center py-4">
          <p className="text-muted-foreground">
            {resource === "Ventures" ?
              (ventureState.ventures.length === 0 ? "No ventures found." : "No more ventures.") :
              (roundState.rounds.length === 0 ? "No rounds found." : "No more rounds.")}
          </p>
        </div>
      )}
    </div>
  );
});
