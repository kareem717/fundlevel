"use client"

import { ComponentPropsWithoutRef, FC, memo, useEffect, useState } from "react"
import { useExploreNavbarStore } from "./use-explore-navbar"
import { useAction } from "next-safe-action/hooks"
import { getVenturesInfinite } from "@/actions/ventures"
import { getRoundsInfinite } from "@/actions/rounds"
import { Venture, Round } from "@/lib/api"
import { toast } from "sonner"
import { useInView } from "react-intersection-observer"
import { Icons } from "@/components/ui/icons"
import Link from "next/link";
import redirects from "@/lib/config/redirects";
import { formatTime, cn, truncateText, toFixedRound } from "@/lib/utils";
import { Card, CardHeader, CardContent, CardFooter, CardTitle, CardDescription } from "@/components/ui/card";
import { buttonVariants } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

export interface VentureIndexCardProps extends ComponentPropsWithoutRef<typeof Card> {
  venture: Venture
};

export const VentureIndexCard: FC<VentureIndexCardProps> = ({ className, venture, ...props }) => {
  const { id, name, description, overview, createdAt, activeRound, business: { industry, ...business } } = venture

  return (
    <Card className={cn("w-full", className)} {...props}>
      <CardHeader>
        <CardTitle>{name} </CardTitle>
        <CardDescription className="flex flex-col gap-2">
          {business.name} &middot; {overview}
          <div className="flex flex-wrap gap-2">
            {activeRound && (
              <>
                <Badge>
                  {/* //TODO: localize */}
                  Raising ${toFixedRound(activeRound.percentageValue, 2)}
                </Badge>
                <Badge>
                  {/* //TODO: localize */}
                  {activeRound.investorCount} investor{activeRound.investorCount > 1 ? "s" : ""}
                </Badge>
              </>
            )}
            <Badge variant="secondary">
              {formatTime(createdAt).charAt(0).toUpperCase() + formatTime(createdAt).slice(1)} old
            </Badge>
          </div>
        </CardDescription>
      </CardHeader>
      <CardContent className="text-sm text-muted-foreground">
        {truncateText(description, 150)}
      </CardContent>
      <CardFooter>
        <Link
          className={cn(buttonVariants(), "w-full")}
          href={redirects.app.explore.ventureView.replace(":id", id.toString())}
        >
          View
        </Link>
      </CardFooter>
    </Card>
  );
};

export interface RoundIndexCardProps extends ComponentPropsWithoutRef<typeof Card> {
  round: Round
};

export const RoundIndexCard: FC<RoundIndexCardProps> = ({ round, className, ...props }) => {
  const {
    id,
    venture: {
      business: { industry, ...business },
      ...venture
    },
    endsAt,
    description,
    buyIn,
    percentageOffered,
    investorCount
  } = round

  const perInvestorPercentage = toFixedRound(percentageOffered / investorCount, 2);

  return (
    <Card className={cn("w-full", className)} {...props}>
      <CardHeader>
        <CardTitle>{venture.name} </CardTitle>
        <CardDescription className="flex flex-col gap-2">
          {business.name} &middot; {venture.overview}
          <div className="flex flex-wrap gap-2">
            <Badge>
              {investorCount} investor{investorCount > 1 ? "s" : ""}
            </Badge>
            <Badge>
              {/* //TODO: localize */}
              {buyIn} buy in
            </Badge>
            <Badge>
              {perInvestorPercentage}% per investor
            </Badge>
            <Badge variant="secondary">
              {formatTime(endsAt).charAt(0).toUpperCase() + formatTime(endsAt).slice(1)} left
            </Badge>
          </div>
        </CardDescription>
      </CardHeader>
      <CardContent className="text-sm text-muted-foreground">
        {truncateText(description, 150)}
      </CardContent>
      <CardFooter>
        <Link
          className={cn(buttonVariants(), "w-full")}
          href={redirects.app.explore.roundView.replace(":id", id.toString())}
        >
          View
        </Link>
      </CardFooter>
    </Card>
  );
};

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
    <VentureIndexCard key={idx} venture={venture} className="w-full h-full" />
  )) : roundState.rounds.map((round, idx) => (
    <RoundIndexCard key={idx} round={round} className="w-full h-full" />
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
