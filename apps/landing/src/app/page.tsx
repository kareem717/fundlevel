import { Hero } from "@/components/hero";
import { FeatureSection } from "@/components/feature-section";
import { LandingSection } from "../components/landing-section";
import { CTACard } from "../components/cta-card";
import { copy } from "@/lib/config/copy";
import { NumberedCard } from "../components/numbered-card";
import { Mail } from "lucide-react";
import { NewsletterSubscribeForm } from "@/components/newsletter-subscribe-form";

export default async function Home() {
  const { ctas, models } = copy.landing;

  return (
    <div className="flex flex-col items-center w-full space-y-20 md:space-y-40">
      <Hero />
      <LandingSection
        title="Platform Features"
        subheading="Powerful Tools & Features"
      >
        <FeatureSection />
      </LandingSection >
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
      <LandingSection>
        <div
          className="grid grid-cols-1 md:grid-cols-2 gap-6 px-6 py-12 rounded-lg sm:px-8 bg-secondary"
        >
          <div className="flex flex-col items-start gap-4 md:flex-row">
            <div className="flex items-center justify-center flex-shrink-0 w-10 h-10 rounded-lg bg-foreground">
              <Mail className="w-6 h-6 text-background" />
            </div>
            <div className="flex flex-col items-start gap-2">
              <h2 className="font-sans text-3xl font-medium text-left">
                Keep up with the latest
              </h2>
              <p className="text-muted-foreground">
                Subscribe to our newsletter to get the latest Fundlevel news.
              </p>
            </div>
          </div>
          <div className="space-y-3 w-full">
            <h3 className="hidden text-sm font-medium text-gray-600 dark:text-gray-300 lg:block">
              Subscribe to our newsletter
            </h3>
            <NewsletterSubscribeForm className="flex flex-row gap-2" inputClassName="bg-background" />
          </div>
        </div>
      </LandingSection>
    </div >
  );
}
