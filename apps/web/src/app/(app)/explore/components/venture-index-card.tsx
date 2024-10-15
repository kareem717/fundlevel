import { ComponentPropsWithoutRef, FC } from "react"
import Link from "next/link";
import redirects from "@/lib/config/redirects";
import { timeSince, cn } from "@/lib/utils";
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { PatternBackground } from "@/components/app/pattern-background";

export interface VentureIndexCardProps extends ComponentPropsWithoutRef<"div"> {
  ventureId: string
  name: string
  createdAt: Date
  href?: string
};

export const VentureIndexCard: FC<VentureIndexCardProps> = ({ className, ventureId, name, createdAt, href, ...props }) => {

  return (
    // TODO: Add a redirect to the venture page
    <Link href={href ?? redirects.app.ventures.view.replace(":id", ventureId)}>
      {/* <div className={cn("bg-card border shadow-sm rounded-md p-4 aspect-square h-full w-full flex flex-col justify-between items-start", className)}>
        <div className="text-lg font-bold">
          {name}
        </div>

      </div> */}
      <Card className="w-full">
        <PatternBackground hash={createdAt.toString()} />
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