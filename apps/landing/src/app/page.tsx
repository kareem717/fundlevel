import { LandingSection } from "../components/landing-section";
import { copy } from "@/lib/config/copy";
import { NumberedCard } from "../components/numbered-card";
import { Mail, ChartLine } from "lucide-react";
import { NewsletterSubscribeForm } from "../components/newsletter-subscribe-form";
import { cn } from "@repo/ui/lib/utils";
import Image from "next/image";
import Balancer from "react-wrap-balancer";
import { BetaRequestLink } from "@/components/beta-request-link";
import { Badge } from "@repo/ui/components/badge";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@repo/ui/components/accordion"

const { models, hero, features, faqs } = copy.landing;

export default async function Home() {
  return (
    <div className="flex flex-col items-center w-full space-y-20 md:space-y-40">
      <LandingSection className="flex flex-col items-center justify-center w-full pt-16 md:pt-32" id="hero">
        <Badge className="rounded-full border bg-green-500 mb-2 sm:mb-6 px-2 py-[1px] sm:px-2.5 sm:py-0.5">
          Private Beta
        </Badge>
        <div className="container flex flex-col items-center justify-center w-full gap-4 px-4 pb-16 text-center sm:px-10 md:pb-24 lg:pb-32">
          <h1 className="text-3xl sm:text-4xl lg:text-7xl">
            <Balancer>
              {hero.title}
            </Balancer>
          </h1>
          <p className="mx-auto text-sm md:text-lg md:w-2/3 text-muted-foreground font-light">
            {hero.description}
          </p>
          <BetaRequestLink className="md:w-4/5 max-w-2xl w-full" size="lg">
            <ChartLine className="mr-2 size-4" />
            Join now
          </BetaRequestLink>
        </div>
        {/* //TODO: Image is a huge SEO cost. maybe cause of svg format or priority tag? */}
        <Image
          className="h-full rounded-md border-2 drop-shadow-xl sm:w-4/5"
          src="/dashboard.jpeg"
          alt="Dashboard"
          width={1550}
          height={800}
          priority
        />
      </LandingSection>
      <LandingSection
        id="features"
        title="Platform Features"
        subheading="Powerful Tools & Features"
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4"
      >
        {features.map((item, index) => (
          <div
            key={index}
            className={cn(
              "p-4 rounded-lg overflow-hidden min-h-[300px] relative bg-secondary",
              // isMobile && 'col-span-1 row-span-1/2',
              'md:col-span-2 md:row-span-2' // Added md breakpoint styles
            )}
          >
            <div className="relative flex flex-col justify-around gap-8 h-full p-2 overflow-hidden group">
              <item.element />
              <div className="relative z-10">
                <h3 className="mb-2 text-xl font-medium tracking-tight">
                  {item.title}
                </h3>
                <p className="text-base font-medium leading-relaxed text-muted-foreground/90">
                  {item.description}
                </p>
              </div>
            </div>
          </div>
        ))}
      </LandingSection >
      <LandingSection
        id="models"
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
        id="faq"
        title="Frequently Asked Questions"
        subheading="All your questions answered."
        className="flex flex-col md:flex-row gap-4 w-full"
      >
        <Accordion type="single" collapsible className="w-full max-w-4xl mx-auto">
          {faqs.map((faq, index) => (
            <AccordionItem value={`faq-${index}`} key={index}>
              <AccordionTrigger>{faq.question}</AccordionTrigger>
              <AccordionContent>
                {faq.answer}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </LandingSection>
      <LandingSection
        id="newsletter"
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
