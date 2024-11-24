import { createElement } from "react";
import { Icons } from "@/components/icons";
import { buttonVariants } from "@/components/ui/button";
import { contact, business } from "@/lib/config";
import Link from "next/link";
import React from "react";
import { cn } from "@/lib/utils";
import { copy } from "@/lib/config";
import { NavBar } from "@/components/nav-bar";
import { navigationConfig } from "@/lib/config/navigation";
import { Hero } from "./components/hero";

export default async function Home() {
  const { landing: { hero } } = copy;

  return (
    <div className="p-4 flex flex-col w-full items-center relative">
      <NavBar config={navigationConfig} currentPath={"/"} className="sticky top-0 z-50" />
      <Hero id="hero" className="pt-56" />
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
