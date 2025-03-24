"use client";

import { type ComponentPropsWithoutRef, useEffect, useState } from "react";
import { LogoDiv } from "./logo-div";
import { type NavigationItem, NavMenu } from "./nav-menu";
import { Button } from "@fundlevel/ui/components/button";
import { cn } from "@fundlevel/ui/lib/utils";
import { ModeToggle } from "./mode-toggle";
import { Menu } from "lucide-react";
import { LogoIcon } from "./icons";
import { env } from "@fundlevel/landing/env";
import Link from "next/link";
import { buttonVariants } from "@fundlevel/ui/components/button";

interface HeaderProps extends ComponentPropsWithoutRef<"header"> {
  config: NavigationItem[];
  currentPath: string;
}

//TODO: the border is not smooth
export function Header({
  className,
  config,
  currentPath,
  ...props
}: HeaderProps) {
  //TODO: simplify this
  const [scrolled, setScrolled] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const isScrolled = window.scrollY > 20;
      if (isScrolled !== scrolled) {
        setScrolled(isScrolled);
      }
    };

    // Check initial scroll position
    handleScroll();

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [scrolled]);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 1024) {
        // lg breakpoint
        setIsOpen(false);
      }
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <header
      className={cn(
        "fixed top-0 z-50 flex flex-col justify-center items-center transition-all duration-300 ease-in-out w-full left-1/2 -translate-x-1/2 rounded-2xl",
        scrolled || isOpen
          ? "bg-background/80 backdrop-blur-md shadow-xl mt-4 border"
          : "bg-transparent",
        isOpen && "!bg-background !backdrop-blur-xl",
        className,
      )}
      {...props}
    >
      <div className="flex flex-row items-center justify-between w-full p-6 h-[7vh]">
        <LogoDiv className="w-24 md:w-32" />
        <NavMenu config={config} className="hidden lg:flex" />
        <div className="flex-row items-center justify-end gap-4 hidden lg:flex">
          <ModeToggle />
          <Link
            href={env.NEXT_PUBLIC_WEB_URL}
            className={cn(buttonVariants({ variant: "default" }), "w-full")}
          >
            Get Started
          </Link>
        </div>
        <div className="flex flex-row items-center justify-end gap-1 lg:hidden">
          <ModeToggle />
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setIsOpen(!isOpen)}
            className="flex items-center justify-center lg:hidden"
            aria-label="Open menu"
          >
            <Menu className="size-6" />
          </Button>
        </div>
      </div>
      {isOpen && (
        <div className="lg:hidden border-t transition-all duration-300 ease-in-out grid sm:grid-cols-2 gap-4 p-4 w-full">
          <NavMenu
            config={config}
            direction="column"
            onClick={() => setIsOpen(false)}
          />
          <div className="flex gap-4 h-full w-full select-none flex-col justify-end rounded-md bg-gradient-to-b from-muted/50 to-muted p-6 no-underline outline-none focus:shadow-md">
            <LogoIcon className="w-24 fill-foreground" />
            <p className="text-sm leading-tight text-muted-foreground">
              The best way to manage your investments.
            </p>
            <Link
              href={env.NEXT_PUBLIC_WEB_URL}
              className={cn(buttonVariants({ variant: "default" }), "w-full")}
            >
              Get Started
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
