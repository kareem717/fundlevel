import { ComponentPropsWithoutRef, FC } from "react"
import {
  Share,
} from "lucide-react"
import { Button, buttonVariants } from "@/components/ui/button"
import {
  Tooltip,
  TooltipTrigger,
  TooltipProvider
} from "@/components/ui/tooltip";
import { cn } from "@/lib/utils"
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"
import { LogoDiv } from "@/components/ui/logo-div"
import redirects from "@/lib/config/redirects"
import { Icons } from "@/components/ui/icons"
import Link from "next/link"

export interface VentureNavProps extends ComponentPropsWithoutRef<"header"> {
  ventureId: string;
};

export const VentureNav: FC<VentureNavProps> = ({ className, ventureId, ...props }) => {
  const { myVentureNav } = redirects

  return (
    <header className={cn("sticky top-0 z-10 flex h-14 items-center gap-1 border-b bg-background px-4", className)} {...props}  >
      <div className="flex items-center justify-center gap-4">
        <Sheet>
          <SheetTrigger className={cn(buttonVariants({ variant: "outline" }), "md:hidden")}>
            <Icons.menu className="size-5" />
          </SheetTrigger>
          <SheetContent side="left">
            <SheetHeader>
              <SheetTitle>
                <LogoDiv href={redirects.app.explore} />
              </SheetTitle>
            </SheetHeader>
            <nav className="grid items-start px-2 text-sm font-medium lg:px-4 mt-4">
              {myVentureNav.map(
                ({ href, label, icon }, index) => {
                  const Icon = Icons[icon]
                  const hrefWithId = href.replace(":id", ventureId)

                  return (
                    <div className="w-full" key={index}>
                      <TooltipProvider disableHoverableContent>
                        <Tooltip delayDuration={100}>
                          <TooltipTrigger asChild>
                            <SheetClose
                              className={cn(buttonVariants({ variant: "ghost" }), "w-full justify-start h-10 mb-1 hover:text-foreground")}
                              asChild
                            >
                              <Link href={hrefWithId}>
                                <span
                                  className={cn("mr-4")}
                                >
                                  <Icon className="h-5 w-5" />
                                </span>
                                <p
                                  className="max-w-[200px] truncate translate-x-0 opacity-100"
                                >
                                  {label}
                                </p>
                              </Link>
                            </SheetClose>
                          </TooltipTrigger>
                        </Tooltip>
                      </TooltipProvider>
                    </div>
                  )
                })}
            </nav >
          </SheetContent>
        </Sheet>
        <h1 className="text-xl font-semibold">Venture</h1>
      </div>
      <Button
        variant="outline"
        size="sm"
        className="ml-auto gap-1.5 text-sm"
      >
        <Share className="size-3.5" />
        Share
      </Button>
    </header>
  );
};