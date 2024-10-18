import { ExploreIndex } from "./components/explore-index"
import { LogoDiv, SmallLogoDiv } from "@/components/ui/logo-div";
import Link from "next/link";
import { ModeToggle } from "@/components/ui/mode-toggle";
import { ExploreToggle } from "./components/explore-toggle";
import { ExploreAuth } from "./components/explore-auth";
import redirects from "@/lib/config/redirects";

export default async function ExplorePage() {
  return (
    <div className="flex flex-col py-4 md:py-8 justify-start items-start gap-2 sm:gap-4 relative h-full">
      <header className="grid grid-rows-1 w-full bg-background border-b border-border py-2 md:py-4 px-4 md:px-8 lg:px-20 max-w-[3000px] mx-auto fixed top-0 left-0 right-0 z-10">
        <div className="flex items-start justify-between w-full relative">
          <LogoDiv className="hidden lg:block my-auto" />
          <SmallLogoDiv className="lg:hidden my-auto" />
          <ExploreToggle className="hidden md:block absolute top-0 left-1/2 transform -translate-x-1/2" />
          <div className="flex items-center justify-center gap-2">
            <Link href={redirects.app.myBusinesses.create} className="hidden sm:block text-sm mr-2">
              List on Fundlevel
            </Link>
            <ExploreAuth />
            <ModeToggle variant="outline" />
          </div>
        </div>
      </header>
      <div className="px-4 md:px-8 lg:px-20 w-full max-w-[3000px] mx-auto h-full">
        <ExploreIndex />
        <div className="sm:hidden fixed bottom-0 left-0 right-0 flex items-center justify-center w-full border-t border-border p-2 bg-background">
          <ExploreToggle className="w-full" />
        </div>
      </div>
    </div>
  );
}