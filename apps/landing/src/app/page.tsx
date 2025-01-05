import { Hero } from "@/app/components/hero";
import { Newsletter } from "@/app/components/newsletter";
import { BentoFeatures } from "@/app/components/bento";
import { LandingSection } from "./components/landing-section";
import { CTACard } from "./components/cta-card";
import { copy } from "@/lib/config/copy";
import { NumberedCard } from "./components/numbered-card";

export default async function Home() {
  const { ctas, models } = copy.landing;

  return (
    <div className="flex flex-col items-center w-full space-y-20 md:space-y-40">
      <Hero />
      <BentoFeatures />
      <LandingSection
        title="Investment Models"
        subheading="Our Services"
      >
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {models.map((model, index) => (
            <NumberedCard
              key={index}
              index={index}
              card={model}
            />
          ))}
        </div>
      </LandingSection>
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
