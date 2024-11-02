import { buttonVariants } from "@/components/ui/button";
import { Icons } from "@/components/ui/icons";
import { QuickSearch } from "@/components/ui/quick-search";
import { Round } from "@/lib/api";
import redirects from "@/lib/config/redirects";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { ActiveRoundsSection } from "./components/active-rounds-section";
import { PastRoundsSection } from "./components/past-rounds-section";

export default function BusinessRoundsPage() {
  return (
    <div className="flex flex-col gap-8">
      <div className="flex justify-between items-center">
        <QuickSearch className="w-full md:max-w-md" />
        {/* <Link href={redirects.app.rounds.create} className={cn(buttonVariants())}>
          <Icons.ellipsis className="size-4" /> 
        </Link> */}
      </div>
      <div className="flex flex-col gap-8">
        <ActiveRoundsSection />
        <PastRoundsSection />
      </div>
    </div>
  );
}

