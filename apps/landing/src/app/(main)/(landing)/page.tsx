import { createElement } from "react";
import { Icons } from "@/components/icons";
import { LogoDiv, SmallLogoDiv } from "@/components/logo-div";
import { buttonVariants } from "@/components/ui/button";
import { contact, business } from "@/lib/config";
import Link from "next/link";
import React from "react";
import { cn } from "@/lib/utils";
import { copy } from "@/lib/config";
import { ModeToggle } from "@/components/mode-toggle";
import { NavBar } from "@/components/nav-bar";
import { navigationConfig } from "@/lib/config/navigation";

export default async function Home() {
  const { landing: { hero } } = copy;

  return (
    <div className="p-4 flex flex-col justify-between h-[100dvh] w-full max-w-screen-2xl mx-auto items-center">
      <NavBar config={navigationConfig} currentPath={"/"} />
      <div className="flex flex-col items-center justify-center gap-4 sm:gap-8">
        <h1 className="text-3xl sm:text-4xl font-bold text-center">
          The right way to <span className="text-primary">fund</span>.
        </h1>
        <div className="flex flex-col gap-4 w-2/3">
          <Link
            href={contact.calendly}
            className={cn("uppercase font-bold w-full", buttonVariants())}
          >
            {hero.meetingCTA}
            <Icons.arrowRight className="size-4 ml-2" />
          </Link>
          <Link
            href={hero.newsletter.signUpURL}
            className={cn("uppercase font-bold w-full", buttonVariants({ variant: "secondary" }))}
          >
            {hero.newsletter.CTA}
          </Link>
        </div>
      </div>
      <footer className="flex flex-col sm:flex-row items-center justify-between w-full">
        <div className="flex items-center justify-center gap-2">
          <div >
            {contact.socials.map(({ icon, link, label }, index) => (
              <Link
                className={cn(buttonVariants({ variant: "ghost", size: "icon" }))}
                key={index}
                href={link}
                aria-label={`Visit us on ${label}`}
              >
                {createElement(Icons[icon], { className: "size-5 fill-current" })}
              </Link>
            ))}
          </div>
          <Link
            href={`mailto:${contact.email}`}
          >
            {contact.email}
          </Link>
        </div>
        <p className="text-xs text-muted-foreground">{business.copyright}</p>
      </footer>
    </div>
  );
}
