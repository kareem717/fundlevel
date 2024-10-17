import { ComponentPropsWithoutRef, FC } from "react"
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { timeSince, cn } from "@/lib/utils";
import { Round, } from "@/lib/api";
import redirects from "@/lib/config/redirects";
import Link from "next/link";

export interface RoundIndexCardProps extends ComponentPropsWithoutRef<typeof Card> {
  round: Round
};

export const RoundIndexCard: FC<RoundIndexCardProps> = ({ round, className, ...props }) => {
  const { createdAt, id } = round

  return (
    <Link href={redirects.app.explore.roundView.replace(":id", id.toString())}>
      <Card className={cn("w-full", className)} {...props}>
        {/* //TODO: make look better */}
        <div className={cn("h-12 w-full rounded-t-lg bg-primary", className)} />
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