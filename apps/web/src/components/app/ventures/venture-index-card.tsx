import { ComponentPropsWithoutRef, FC } from "react"
import Link from "next/link";
import redirects from "@/lib/config/redirects";
import { timeSince, cn } from "@/lib/utils";

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
      <div className={cn("bg-card border shadow-sm rounded-md p-4 aspect-square h-full w-full flex flex-col justify-between items-start", className)}>
        <div className="text-lg font-bold">
          {name}
        </div>
        <span className="text-xs text-muted-foreground">
          Created {timeSince(createdAt)}
        </span>
      </div>
    </Link>
  );
};