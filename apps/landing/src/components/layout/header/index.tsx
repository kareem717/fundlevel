import { ComponentPropsWithoutRef } from "react";
import { LogoDiv } from "../../logo-div";
import { NavigationItem, NavMenu } from "./nav";
import { buttonVariants } from "../../ui/button";
import { Icons } from "../../icons";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "../../ui/sheet";
import Link from "next/link";
import { cn } from "@/lib/utils";

interface HeaderProps extends ComponentPropsWithoutRef<"header"> {
  config: NavigationItem[];
  currentPath: string;
}

export function Header({
  className,
  config,
  currentPath,
  ...props
}: HeaderProps) {
  return (
    <header
      className={cn(
        "flex flex-row items-center justify-between w-full bg-background p-4 h-[8vh]",
        className
      )}
      {...props}
    >
      <LogoDiv className="justify-start" />
      <NavMenu
        config={config}
        currentPath={currentPath}
        className="hidden sm:flex"
      />
      <div className="flex-row items-center justify-end gap-4 hidden sm:flex">
        <Link href="#" className={buttonVariants()}>
          Invest
        </Link>
        <Link href="#" className={buttonVariants({ variant: "secondary" })}>
          Raise
        </Link>
      </div>
      <Sheet>
        <SheetTrigger className="sm:hidden">
          <Icons.menu className="size-6" />
        </SheetTrigger>
        <SheetContent>
          <SheetHeader>
            <SheetTitle>Are you absolutely sure?</SheetTitle>
            <SheetDescription></SheetDescription>
          </SheetHeader>
          <NavMenu
            config={config}
            currentPath={currentPath}
            direction="column"
          />
        </SheetContent>
      </Sheet>
    </header>
  );
}
