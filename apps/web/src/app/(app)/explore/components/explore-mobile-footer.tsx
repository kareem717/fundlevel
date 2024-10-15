import { ComponentPropsWithoutRef, FC } from "react"
import { cn } from "@/lib/utils"
import { ExploreToggle } from "./explore-toggle"

export interface ExploreMobileFooterProps extends ComponentPropsWithoutRef<"footer"> { };

export const ExploreMobileFooter: FC<ExploreMobileFooterProps> = ({ className, ...props }) => {
  return (
    <div className={cn("flex items-center justify-center w-full border-t border-border p-2 bg-background", className)} {...props}  >
      <ExploreToggle className="w-full" />
    </div>
  );
};