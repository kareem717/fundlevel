"use client";

import { ComponentPropsWithoutRef, useEffect, useState } from "react";
import { LogoDiv } from "./logo-div";
import { NavigationItem, NavMenu } from "./nav-menu";
import { Button, buttonVariants } from "@repo/ui/components/button";
import Link from "next/link";
import { cn } from "@repo/ui/lib/utils";
import { ModeToggle } from "./mode-toggle";
import { env } from "@/env";
import { Menu } from "lucide-react";

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
        className
      )}
      {...props}
    >
      <div className="flex flex-row items-center justify-between w-full p-6 h-[7vh]">
        <LogoDiv className="w-20 md:w-32" />
        <NavMenu
          config={config}
          currentPath={currentPath}
          className="hidden lg:flex"
        />
        <div className="flex-row items-center justify-end gap-4 hidden lg:flex">
          <ModeToggle />
          <Link
            href={env.NEXT_PUBLIC_NEWS_LETTER_SIGN_UP_URL}
            className={buttonVariants()}
            aria-label="Get Started"
          >
            Get Started
          </Link>
        </div>
        {/* <Link href="#" className={buttonVariants({ variant: "secondary" })}>
            Raise
          </Link> */}
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
        <div className="lg:hidden border-t transition-all duration-300 ease-in-out grid grid-cols-2 gap-4 p-4 w-full">
          <NavMenu
            config={config}
            currentPath={currentPath}
            direction="column"
            className="col-span-2"
          />
          <Link
            href="#"
            className={buttonVariants({ className: "w-full" })}
            aria-label="Invest"
          >
            Invest
          </Link>
          <Link
            href="#"
            className={buttonVariants({
              variant: "secondary",
              className: "w-full",
            })}
            aria-label="Raise"
          >
            Raise
          </Link>
        </div>
      )}
    </header>
  );
};
