import { Hero } from "@/app/components/hero";
import { CTA } from "@/app/components/cta";
import { Newsletter } from "@/app/components/newsletter";
import { Models } from "@/app/components/models";
import { BentoFeatures } from "@/app/components/bento";

export default async function Home() {
  return (
    <main className="relative flex flex-col items-center w-full">
      <Hero id="hero" />
      <BentoFeatures />
      <Models />
      <CTA />
      <Newsletter />
    </main>
  );
}
