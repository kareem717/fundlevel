import { ExploreIndex } from "./components/explore-index";
import { LogoDiv, SmallLogoDiv } from "@/components/ui/logo-div";
import Link from "next/link";
import { ModeToggle } from "@/components/ui/mode-toggle";
import { ExploreToggle } from "./components/layout/nav/explore-toggle";
import { ExploreAuth } from "./components/layout/nav/explore-auth";
import redirects from "@/lib/config/redirects";
import { getAllIndustries } from "@/actions/industries";
import FilterBar from "./components/filter-bar";

export default async function ExplorePage() {
  return (
    <div className="flex flex-col py-4 md:py-8 justify-start items-start gap-2 sm:gap-4 relative h-full">
      {/* <FilterBar /> */}
      <div className="px-4 md:px-8 lg:px-20 w-full max-w-[3000px] mx-auto h-full">
        <ExploreIndex />
      </div>
    </div>
  );
}
