import { copy } from "@/lib/config";
import { NavBar } from "@/components/nav-bar";
import { navigationConfig } from "@/lib/config/navigation";
import { Hero } from "./components/hero";

export default async function Home() {
  const { landing: { hero } } = copy;

  return (
    <div className="flex flex-col w-full items-center justify-center relative">
      <NavBar config={navigationConfig} currentPath={"/"} className="sticky top-0 z-50" />
      <Hero
        id="hero"
        className="pt-8 md:pt-56 lg:pt-64 w-full h-[95dvh] md:h-[70vh] xl:h-[1028px]"
      />
    </div>
  );
}
