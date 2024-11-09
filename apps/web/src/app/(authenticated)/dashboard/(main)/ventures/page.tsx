import { QuickSearch } from "@/components/quick-search";
import { VenturesSection } from "./components/ventures-section";


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
        <VenturesSection />
      </div>
    </div>
  );
}

