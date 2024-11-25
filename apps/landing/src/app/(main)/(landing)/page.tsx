import { Hero } from "@/app/(main)/(landing)/components/hero";
import { Newsletter } from "@/app/(main)/(landing)/components/newsletter";
import { Features } from "@/app/(main)/(landing)/components/features";

export default async function Home() {
  return (
    <div className="flex flex-col w-full items-center relative gap-4">
      <Hero id="hero" />
      <Features />
      <Newsletter />
    </div>
  );
}
