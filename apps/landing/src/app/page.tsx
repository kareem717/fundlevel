import { FeatureSection } from "@/components/feature-section";
import { LandingSection } from "../components/landing-section";
import { CTACard } from "../components/cta-card";
import { copy } from "@/lib/config/copy";
import { NumberedCard } from "../components/numbered-card";
import { Wallet, Mail, ChartLine } from "lucide-react";
import { NewsletterSubscribeForm } from "../components/newsletter-subscribe-form";
import { buttonVariants } from "@repo/ui/components/button";
import { env } from "@/env";
import { cn } from "@repo/ui/lib/utils";
import Image from "next/image";
import Link from "next/link";
import Balancer from "react-wrap-balancer";

const { ctas, models, hero } = copy.landing;

export default async function Home() {
  return (
    <div className="flex flex-col items-center w-full space-y-20 md:space-y-40">
      <LandingSection className="relative w-full">
        <div className="container flex flex-col items-center justify-center w-full gap-4 px-4 pb-16 text-center sm:px-10 md:pb-24 lg:pb-32 pt-20 md:pt-36 mx-auto">
          <h1 className="text-3xl sm:text-4xl lg:text-7xl">
            <Balancer>
              {hero.title}
            </Balancer>
          </h1>
          <p className="mx-auto text-sm md:text-lg md:w-2/3 text-muted-foreground font-light">
            {hero.description}
          </p>
          <div className="grid w-full max-w-2xl grid-cols-1 sm:grid-cols-2 gap-4 mt-2">
            <Link
              href="#"
              className={cn(
                buttonVariants({ variant: 'secondary', size: 'lg' }),
                'flex flex-row items-center justify-center'
              )}
            >
              <ChartLine className="mr-2 size-4" />
              Invest
            </Link>
            <Link
              aria-label="Get Started"
              href={env.NEXT_PUBLIC_NEWS_LETTER_SIGN_UP_URL}
              className={cn(
                buttonVariants({ size: 'lg' }),
                'flex flex-row items-center justify-center'
              )}
            >
              <Wallet className="mr-2 size-4" />
              Get Started
            </Link  >
          </div>
        </div>
        {/* //TODO: Image is a huge SEO cost. maybe cause of svg format or priority tag? */}
        <Image
          className="h-full w-full rounded-md border-2 drop-shadow-xl"
          src="/dashboard.jpeg"
          alt="Dashboard"
          width={1550}
          height={800}
          priority
        />
      </LandingSection>
      <LandingSection
        title="Platform Features"
        subheading="Powerful Tools & Features"
      >
        <FeatureSection />
      </LandingSection >
      <LandingSection
        title="Investment Models"
        subheading="Our Services"
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4"
      >
        {models.map((model, index) => (
          <NumberedCard
            key={index}
            index={index}
            card={model}
          />
        ))}
      </LandingSection>
      <LandingSection
        title="Join Fundlevel"
        subheading="Invest and raise capital with confidence."
        className="flex flex-col md:flex-row gap-4 w-full"
      >
        {ctas.map((cta, index) => (
          <CTACard
            key={index}
            index={index}
            cta={cta}
          />
        ))}
      </LandingSection>
      <LandingSection
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
      </LandingSection>
    </div >
  );
}
