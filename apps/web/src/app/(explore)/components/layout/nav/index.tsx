import React from "react";
import Link from "next/link";
import { LogoDiv } from "@/components/ui/logo-div";
import redirects from "@/lib/config/redirects";
import { SmallLogoDiv } from "@/components/ui/logo-div";
import { ExploreToggle } from "./explore-toggle";
import { ModeToggle } from "@/components/ui/mode-toggle";
import { ExploreAuth } from "./explore-auth";

export function ExploreNav() {
  return (
    <header className="block z-50 min-h-[100px] w-full bg-background">
      <div className="fixed top-0 bg-background border-b border-border w-full">
        <div className="container flex justify-between items-center py-4">
          <LogoDiv className="hidden lg:flex my-auto" />
          <SmallLogoDiv className="lg:hidden my-auto" />
          <ExploreToggle className="hidden sm:block" />
          <div className="flex items-center justify-center gap-2">
            <Link
              href={redirects.app.myBusinesses.create}
              className="hidden sm:block text-sm mr-2"
            >
              List on Fundlevel
            </Link>
            <ExploreAuth />
            <ModeToggle variant="outline" />
          </div>
        </div>
      </div>
      <div className="sm:hidden fixed bottom-0 left-0 right-0 flex items-center justify-center w-full border-t border-border p-2 bg-background">
        <ExploreToggle className="w-full" />
      </div>
    </header>
  );
}
