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