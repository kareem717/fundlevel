import { Hero } from "@/app/components/hero";
import { CTA } from "@/app/components/cta";
import { Newsletter } from "@/app/components/newsletter";
import { Models } from "@/app/components/models";
import { BentoFeatures } from "@/app/components/bento";

export default async function Home() {
  return (
    <div className="flex flex-col items-center w-full space-y-20 md:space-y-40">
      <Hero />
      <BentoFeatures />
      <Models />
      <CTA />
      <Newsletter />
    </div>
  );
}
