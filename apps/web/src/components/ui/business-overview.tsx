"use client"

import { memo, ComponentPropsWithoutRef, FC, useEffect, useState } from "react"
import { Icons } from "@/components/ui/icons"
import { cn } from "@/lib/utils"
import { Skeleton } from "./skeleton";
import { useAction } from "next-safe-action/hooks";
import { getBusinessFunding } from "@/actions/busineses";
import { toast } from "sonner";

export interface BusinessOverviewProps extends ComponentPropsWithoutRef<"div"> {
  overview: string;
  teamSize: string;
  businessId: number;
};

export const BusinessOverview: FC<BusinessOverviewProps> = memo(({ className, overview, teamSize, businessId, ...props }) => {
  const [previousFunding, setPreviousFunding] = useState<number | undefined>(undefined);

  const { execute } = useAction(getBusinessFunding, {
    onSuccess: ({ data }) => {
      setPreviousFunding(0);
    },
    onError: () => {
      toast.error("Failed to fetch previous funding");
      setPreviousFunding(0);
    }
  })

  useEffect(() => {
    execute(businessId);
  }, []);

  return (
    <div className={cn("flex flex-col gap-8 items-start justify-center", className)} {...props}>
      <div className="flex gap-4 text-sm sm:text-base">
        <Icons.building className="size-9 text-muted-foreground mt-1" />
        <div className="flex flex-col gap-1">
          Company Overview
          <span className="text-muted-foreground">
            {overview}
          </span>
        </div>
      </div>
      <div className="flex gap-4 text-sm sm:text-base">
        <Icons.users className="size-9 text-muted-foreground mt-1" />
        <div className="flex flex-col gap-1">
          Team Size
          <span className="text-muted-foreground">
            {teamSize} people
          </span>
        </div>
      </div>
      <div className="flex gap-4 text-sm sm:text-base">
        {previousFunding !== undefined ? (
          <>
            {previousFunding > 0 ? (
              <Icons.badgeCheck className="size-9 text-muted-foreground mt-1" />
            ) : (
              <Icons.badgeInfo className="size-9 text-muted-foreground mt-1" />
            )}
            <div className="flex flex-col gap-1">
              Previous Funding
              <span className="text-muted-foreground flex items-center gap-2">
                {/* //TODO: localize */}
                This business has {previousFunding > 0 ? `previously raised $${previousFunding}` : "not yet raised money"}
              </span>
            </div>
          </>
        ) : (
          <div className="flex gap-4 w-64 h-12">
            <Skeleton className="w-12 aspect-square h-full" />
            <div className="flex flex-col gap-1 w-full mt-1">
              <Skeleton className="w-1/3 h-4" />
              <Skeleton className="w-full h-4" />
            </div>
          </div>
        )}
      </div>
    </div>
  );
});
