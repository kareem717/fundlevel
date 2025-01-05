import { Hero } from "@/app/components/hero";
import { Newsletter } from "@/app/components/newsletter";
import { Models } from "@/app/components/models";
import { BentoFeatures } from "@/app/components/bento";
import { LandingSection } from "./components/landing-section";
import { CTACard } from "./components/cta-card";
import { copy } from "@/lib/config/copy";

export default async function Home() {
  const { ctas } = copy.landing;

  return (
    <div className="flex flex-col items-center w-full space-y-20 md:space-y-40">
      <Hero />
      <BentoFeatures />
      <Models />
      <LandingSection
        title="Join Fundlevel"
        subheading="Invest and raise capital with confidence."
      >
        <div className="flex flex-col md:flex-row gap-4 w-full">
          {ctas.map((cta, index) => (
            <CTACard
              key={index}
              index={index}
              cta={cta}
            />
          ))}
        </div>
      </LandingSection>
      <Newsletter />
    </div>
  );
}
