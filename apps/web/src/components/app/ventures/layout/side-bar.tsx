import { ComponentPropsWithoutRef, FC } from "react"
import { Button, buttonVariants } from "@/components/ui/button"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import { SmallLogoDiv } from "@/components/ui/logo-div"
import { cn } from "@/lib/utils"
import { Icons } from "@/components/ui/icons"
import Link from "next/link"
import redirects from "@/lib/config/redirects"

export interface VentureSideBarProps extends ComponentPropsWithoutRef<"aside"> {
  ventureId: string
};

export const VentureSideBar: FC<VentureSideBarProps> = ({ className, ventureId, ...props }) => {
  const { myVentureNav } = redirects

  return (
    <TooltipProvider>
      <aside className={cn("inset-y fixed left-0 z-20 flex h-full flex-col border-r", className)} {...props}  >
        <div className="border-b p-2 h-14 flex items-center justify-center">
          <SmallLogoDiv href={redirects.app.explore} />
        </div>
        <nav className="grid gap-1 p-2">
          {myVentureNav.map(({ label, icon, href }, index) => {
            const hrefWithParam = href.replace(':id', ventureId)

            const Icon = Icons[icon]

            return (
              <Tooltip key={index}>
                <TooltipTrigger asChild>
                  <Link
                    href={hrefWithParam}
                    className={cn(buttonVariants({
                      variant: "ghost",
                      size: "icon",
                    }), "rounded-lg")}
                    aria-label={label}
                  >
                    <Icon className="size-5" />
                  </Link>
                </TooltipTrigger>
                <TooltipContent side="right" sideOffset={5}>
                  {label}
                </TooltipContent>
              </Tooltip>
            )
          })}
        </nav>
      </aside>
    </TooltipProvider >
  );
};