import { ComponentPropsWithoutRef, FC } from "react"
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "../../../components/ui/sheet";
import { Separator } from "../../../components/ui/separator";
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
} from "../../../components/ui/navigation-menu";
import { Button, buttonVariants } from "../../../components/ui/button";
import Link from "next/link";
import { ModeToggle } from "./mode-toggle";
import { Icons } from "../../../components/ui/icons";
import { LogoDiv } from "../../../components/ui/logo-div";
import landingConfig from "@/lib/config/landing";
import { cn } from "@/lib/utils";

export interface LandingNavProps extends ComponentPropsWithoutRef<"header"> { };

export const LandingNav: FC<LandingNavProps> = ({ className, ...props }) => {
  const { nav, socials } = landingConfig;

  return (
    <header className={cn("shadow-sm dark:shadow-inner bg-opacity-15 w-[90%] md:w-[70%] lg:w-[75%] lg:max-w-screen-xl top-5 mx-auto sticky border z-40 rounded-2xl flex justify-between items-center p-2 px-4 md:px-6 bg-card", className)} {...props}>
      <LogoDiv />
      <div className="flex items-center lg:hidden">
        <Sheet>
          <SheetTrigger asChild>
            <Icons.menu
              className="cursor-pointer lg:hidden"
            />
          </SheetTrigger>
          <SheetContent
            className="flex flex-col justify-between rounded-tr-2xl rounded-br-2xl bg-card border-secondary"
          >
            <div>
              <SheetHeader className="mb-4 ml-4">
                <SheetTitle className="flex items-center">
                  <LogoDiv />
                </SheetTitle>
              </SheetHeader>
              <div className="flex flex-col gap-2">
                {nav.map(({ href, label }) => (
                  <SheetClose
                    key={href}
                    asChild
                    className={cn(buttonVariants({ variant: "ghost" }), "justify-start text-base")}
                  >
                    <Link href={href}>{label}</Link>
                  </SheetClose>
                ))}
              </div>
            </div>
            <SheetFooter className="flex-col sm:flex-col justify-start items-start">
              <Separator className="mb-2" />
              <div className="flex justify-between items-center gap-2 w-full">
                <ModeToggle />
                <div className="flex justify-center items-center gap-2">
                  {socials.map(({ icon, href, label }, index) => {
                    const Icon = Icons[icon];
                    return (
                      <Button asChild size="sm" variant="ghost" aria-label={`View on ${label}`} key={index}>
                        <Link
                          href={href}
                        >
                          <Icon className="size-5" />
                        </Link>
                      </Button>
                    )
                  })}
                </div>
              </div>
            </SheetFooter>
          </SheetContent>
        </Sheet>
      </div>
      <NavigationMenu className="hidden lg:block mx-auto">
        <NavigationMenuList>
          <NavigationMenuItem>
            {nav.map(({ href, label }) => (
              <NavigationMenuLink key={href} asChild>
                <Link href={href} className="text-base px-2">
                  {label}
                </Link>
              </NavigationMenuLink>
            ))}
          </NavigationMenuItem>
        </NavigationMenuList>
      </NavigationMenu>
      <div className="hidden lg:flex">
        <ModeToggle />
        {socials.map(({ icon, href, label }, index) => {
          const Icon = Icons[icon];
          return (
            <Button asChild size="sm" variant="ghost" aria-label={`View on ${label}`} key={index}>
              <Link
                href={href}
              >
                <Icon className="size-5" />
              </Link>
            </Button>
          )
        })}
      </div>
    </header>
  );
};