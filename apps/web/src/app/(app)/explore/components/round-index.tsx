import { ComponentPropsWithoutRef, FC } from "react"
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { PatternBackground } from "@/components/app/pattern-background";
import { timeSince, cn } from "@/lib/utils";
import { RoundWithSubtypes } from "@/lib/api";
import redirects from "@/lib/config/redirects";
import Link from "next/link";

export interface RoundIndexCardProps extends ComponentPropsWithoutRef<"div"> {
  round: RoundWithSubtypes
};

export const RoundIndexCard: FC<RoundIndexCardProps> = ({ round, className, ...props }) => {
  const { createdAt, id } = round

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
  rounds: RoundWithSubtypes[]
};

export const RoundIndex: FC<RoundIndexProps> = ({ rounds, ...props }) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-4">
      {rounds.map((round) => (
        <RoundIndexCard key={round.id} round={round} />
      ))}
    </div>
  );
};