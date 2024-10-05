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
    <div className="flex flex-col items-center justify-between h-full w-full p-4">
      <header className="flex flex-row items-center justify-between y-4 w-full">
        <LogoDiv />
        <ModeToggle />
      </header>
      <div className="flex flex-col items-center justify-center gap-6">
        <h1 className="text-4xl font-bold">
          {landing.hero.title}
        </h1>
        <Link
          href={contact.calendly}
          className={cn("uppercase font-bold", buttonVariants())}
        >
          {landing.hero.meetingCTA}
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
