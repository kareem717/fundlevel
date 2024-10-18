import { ComponentPropsWithoutRef, FC } from "react"
import Link from "next/link";
import redirects from "@/lib/config/redirects";
import { timeSince, cn } from "@/lib/utils";
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { Venture } from "@/lib/api";

export interface VentureIndexCardProps extends ComponentPropsWithoutRef<typeof Card> {
  venture: Venture
};

export const VentureIndexCard: FC<VentureIndexCardProps> = ({ className, venture, ...props }) => {
  const { id, name, createdAt } = venture

  return (
    <Link href={redirects.app.explore.ventureView.replace(":id", id.toString())}>
      <Card className={cn("w-full", className)} {...props}>
        {/* //TODO: make look better */}
        <div className={cn("h-12 w-full rounded-t-lg bg-primary", className)} />
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
