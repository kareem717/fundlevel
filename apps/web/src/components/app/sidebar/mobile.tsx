import { ComponentPropsWithoutRef, FC } from "react"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTrigger, SheetHeader } from "@/components/ui/sheet"
import { Menu } from "./menu"
import { Icons } from "@/components/ui/icons"
import { ModeToggle } from "@/components/app/mode-toggle"
import { LogoDiv } from "@/components/ui/logo-div"
import { ScrollArea } from "@/components/ui/scroll-area"
export interface MobileSidebarProps extends ComponentPropsWithoutRef<typeof Sheet> { }

export const Sidebar: FC<MobileSidebarProps> = ({ ...props }) => {
  return (
    <Sheet {...props}>
      <SheetTrigger asChild>
        <Button
          variant="outline"
          size="icon"
          className="shrink-0"
        >
          <Icons.menu className="h-5 w-5" />
          <span className="sr-only">Toggle navigation menu</span>
        </Button>
      </SheetTrigger>
      <SheetContent side="left" className="flex flex-col">
        <SheetHeader className="px-2">
          <LogoDiv />
        </SheetHeader>
        <div className="overflow-y-auto">
          <ScrollArea className="h-full w-full">
            <Menu />
          </ScrollArea>
        </div>
        <ModeToggle className="mt-auto px-2 text-sm font-medium" />
      </SheetContent>
    </Sheet>
  )
}