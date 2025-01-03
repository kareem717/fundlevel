import { Hero } from "@/components/routes/home/hero";
import { CTA } from "@/components/routes/home/cta";
import { Newsletter } from "@/components/routes/home/newsletter";
import { Models } from "@/components/routes/home/models";
import { BentoFeatures } from "@/components/routes/home/bento";

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
