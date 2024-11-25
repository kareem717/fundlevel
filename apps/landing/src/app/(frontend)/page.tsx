import { business, contact, copy } from "@/lib/config";
import { NavBar } from "@/components/nav-bar";
import { navigationConfig } from "@/lib/config/navigation";
import { Hero } from "@/components/landing/hero";
import { BentoDemo } from "@/components/landing/bento";
import Newsletter from "@/components/landing/newsletter";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { buttonVariants } from "@/components/ui/button";
import { Icons } from "@/components/icons";
import { createElement } from "react";

export default async function Home() {
  const {
    landing: { hero },
  } = copy;

  return (
    <div className="flex flex-col w-full items-center relative gap-4">
      <NavBar
        config={navigationConfig}
        currentPath={"/"}
        className="sticky top-0 z-50 border-b w-full"
      />
      <Hero id="hero" className="w-full py-4 h-[95dvh]" />

      <div className="flex flex-col items-center justify-center mx-auto px-4 gap-4 sm:gap-8">
        <BentoDemo />
        <Newsletter />
      </div>

      <footer className="flex flex-col sm:flex-row items-center justify-between w-full">
        <div className="flex items-center justify-center gap-2">
          <div>
            {contact.socials.map(({ icon, link, label }, index) => (
              <Link
                className={cn(
                  buttonVariants({ variant: "ghost", size: "icon" })
                )}
                key={index}
                href={link}
                aria-label={`Visit us on ${label}`}
              >
                {createElement(Icons[icon], {
                  className: "size-5 fill-current",
                })}
              </Link>
            ))}
          </div>
          <Link href={`mailto:${contact.email}`}>{contact.email}</Link>
        </div>
        <p className="text-xs text-muted-foreground">{business.copyright}</p>
      </footer>
    </div>
  );
}
