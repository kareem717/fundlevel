import { QuickSearch } from "@/components/quick-search";
import { ActiveRoundsSection } from "./components/active-rounds-section";
import { PastRoundsSection } from "./components/past-rounds-section";

export default function BusinessRoundsPage() {
  return (
    <div className="flex flex-col gap-8">
      <div className="flex justify-between items-center">
        <QuickSearch className="w-full md:max-w-md" />
        {/* <Link href={redirects.dashboard.rounds.create} className={cn(buttonVariants())}>
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

