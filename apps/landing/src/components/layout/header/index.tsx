"use client";

import { ComponentPropsWithoutRef, useEffect, useState, FC } from "react";
import { LogoDiv } from "@/components/layout/logo-div";
import { NavigationItem, NavMenu } from "./nav";
import { buttonVariants } from "@repo/ui/components/button";
import { Icons } from "@/components/icons";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { ModeToggle } from "@/components/layout/mode-toggle";
import { env } from "@/env";

interface HeaderProps extends ComponentPropsWithoutRef<"header"> {
  config: NavigationItem[];
  currentPath: string;
}

export const Header: FC<HeaderProps> = ({
  className,
  config,
  currentPath,
  ...props
}) => {
  const [scrolled, setScrolled] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const isScrolled = window.scrollY > 20;
      if (isScrolled !== scrolled) {
        setScrolled(isScrolled);
      }
    };

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
        "fixed top-0 z-50 flex flex-col w-full transition-all duration-300 ease-in-out",
        scrolled || isOpen
          ? "bg-background/80 backdrop-blur-md shadow-xl mx-4 mt-4 rounded-2xl w-[calc(100%-2rem)] border"
          : "bg-transparent",
        isOpen && "!bg-background !backdrop-blur-xl",
        className
      )}
      {...props}
    >
      <div className="flex flex-row items-center justify-between w-full p-6 h-[7vh]">
        <LogoDiv className="justify-start" />
        <NavMenu
          config={config}
          currentPath={currentPath}
          className="hidden lg:flex"
        />
        <div className="flex-row items-center justify-end gap-4 hidden lg:flex">
          <ModeToggle />
          <Link href={env.NEXT_PUBLIC_NEWS_LETTER_SIGN_UP_URL} className={buttonVariants()}>
            Get Started
          </Link>
          {/* <Link href="#" className={buttonVariants({ variant: "secondary" })}>
            Raise
          </Link> */}
        </div>
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="flex items-center justify-center lg:hidden"
        >
          <Icons.menu className="size-6" />
        </button>
      </div>

      {isOpen && (
        <div className="flex flex-col lg:hidden border-t transition-all duration-300 ease-in-out">
          <div className="grid grid-cols-2 gap-4 p-4">
            <NavMenu
              config={config}
              currentPath={currentPath}
              direction="column"
              className="col-span-2"
            />
            <Link href="#" className={buttonVariants({ className: "w-full" })}>
              Invest
            </Link>
            <Link
              href="#"
              className={buttonVariants({
                variant: "secondary",
                className: "w-full",
              })}
            >
              Raise
            </Link>
            <div className="col-span-2 flex justify-center">
              <ModeToggle />
            </div>
          </div>
        </div>
      )}
    </header>
  );
};
