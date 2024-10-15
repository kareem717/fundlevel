import { ComponentPropsWithoutRef, FC } from "react"
import Link from "next/link";
import redirects from "@/lib/config/redirects";
import { timeSince, cn } from "@/lib/utils";
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { PatternBackground } from "@/components/app/pattern-background";
import { ScrollArea } from "@radix-ui/react-scroll-area";

export type VentureIndexCard = {
  ventureId: string
  name: string
  createdAt: Date
  href?: string
}

export interface VentureIndexCardProps extends ComponentPropsWithoutRef<"div"> {
  venture: VentureIndexCard
};

export const VentureIndexCard: FC<VentureIndexCardProps> = ({ className, venture, ...props }) => {
  const { ventureId, name, createdAt, href } = venture

  return (
    // TODO: Add a redirect to the venture page
    <Link href={href ?? redirects.app.ventures.view.replace(":id", ventureId)}>
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
  ventures: VentureIndexCard[]
};

export const VentureIndex: FC<VentureIndexProps> = ({ ventures, ...props }) => {
  return (
    <div className="w-full h-full">
      <ScrollArea className="w-full h-full">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-4 py-16 md:py-20">
          {ventures.map((venture) => (
            <VentureIndexCard key={venture.ventureId} venture={venture} className="w-full" />
          ))}
        </div>
      </ScrollArea>
    </div>

  );
};