import { createElement } from "react";
import { Icons } from "@/components/icons";
import { LogoDiv } from "@/components/logo-div";
import { buttonVariants } from "@/components/ui/button";
import { contact, business } from "@/lib/config";
import Link from "next/link";
import React from "react";
import { cn } from "@/lib/utils";
import { copy } from "@/lib/config";
import { ModeToggle } from "@/components/mode-toggle";

export default async function Home() {
  const { landing } = copy;

  return (
    <div className="p-4 flex flex-col justify-between h-[100dvh] w-full items-center">
      <header className="flex flex-row items-center justify-between y-4 w-full">
        <LogoDiv />
        <ModeToggle />
      </header>
      <div className="flex flex-col items-center justify-center gap-4 sm:gap-8">
        <h1 className="text-3xl sm:text-4xl font-bold text-center">
          The right way to <span className="text-primary">fund</span>.
        </h1>
        <Link
          href={contact.calendly}
          className={cn("uppercase font-bold", buttonVariants({ variant: "outline" }))}
        >
          {landing.hero.meetingCTA}
          <Icons.arrowRight className="size-4 ml-2" />
        </Link>
      </div>
      <footer className="flex flex-col sm:flex-row items-center justify-between w-full">
        <div className="flex items-center justify-center gap-2">
          <div >
            {contact.socials.map(({ icon, link }, index) => (
              <Link
                className={cn(buttonVariants({ variant: "ghost", size: "icon" }))}
                key={index}
                href={link}
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
