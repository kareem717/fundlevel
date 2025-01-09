import { LandingSection } from "../components/landing-section";
import { copy } from "@/lib/config/copy";
import { NumberedCard } from "../components/numbered-card";
import { Mail, ChartLine, Megaphone, ChevronRight } from "lucide-react";
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
import { contact } from "@/lib/config/company";
import { env } from "@/env";
import Link from "next/link";
import { HeroBadge } from "@/components/hero-badge";

const { services, hero, features } = copy.landing;

const faqs = [
  {
    question: 'What is Fundlevel?',
    answer: (
      <>
        <p>
          Fundlevel is a platform that helps you raise capital and invest in high-growth opportunities.
          We provide a white glove experience for all things equity crowdfunding.
          We also offer a public marketplace for businesses to raise capital and for investors to explore investment opportunities.
        </p>
        <br />
        <p>
          Our services are also available to businesses that simply want to raise capital through their own channels - thus we offer
          'modular' services that you can mix and match to fit your business needs, like compliance, payment processing, and more.
        </p>
      </>
    ),
  },
  {
    question: "What's the price?",
    answer: (
      <>
        <p>
          Simply put, the listing on our marketplace is free whilst our advanced services are paid. We are focused on providing real value by
          helping companies who are fundraising save time and money - thus we only charge for services that
          really ease the burden of raising capital. Our pricing is currently on a case by case basis, but we are working on making it more standardized.
        </p>
        <br />
        <p>
          Don't let that scare you though - we are very quick to respond with a accurate price if you reach out to us at:&nbsp;
          <Link href={`mailto:${contact.email}`} aria-label="Email us at" className="text-primary underline">
            {contact.email}
          </Link>
        </p>
      </>
    ),
  },
  {
    question: 'Can anyone be listed?',
    answer: (
      <>
        <p>
          We adhere to a strict moral and ethical code of conduct. We do not list any businesses that are not in line with our values.
          Companies that participate in gambling, sex work, certain forms of finance, etc. are not eligible for listing - though feel free to
          submit a quick application to see if you qualify.
        </p>
      </>
    ),
  },
  {
    question: 'How can I get started?',
    answer: (
      <>
        <p>
          Currently we are operating in a private beta, and are only accepting a limited number of businesses. If you are interested as either an investor or business,
          please <Link href={env.NEXT_PUBLIC_BETA_REQUEST_LINK} className="text-primary underline" aria-label="Click here to get started">click here to get started</Link>&nbsp;
          or reach out to us at:&nbsp;<Link href={`mailto:${contact.email}`} aria-label="Email us at">
            {contact.email}
          </Link>
        </p>
      </>
    ),
  },
]

export default async function Home() {
  return (
    <div className="flex flex-col items-center w-full space-y-20 md:space-y-40">
      <LandingSection className="flex flex-col items-center justify-center w-full pt-16 md:pt-32" id="hero">
        {/* <Badge className="rounded-full border bg-green-500 mb-2 sm:mb-6 px-2 py-[1px] sm:px-2.5 sm:py-0.5">
          Private Beta
        </Badge> */}
        <HeroBadge
          href={env.NEXT_PUBLIC_BETA_REQUEST_LINK}
          text="New! Private Beta"
          icon={<Megaphone className="h-4 w-4" />}
          endIcon={<ChevronRight className="h-4 w-4" />}
          className="bg-blue-500 dark:bg-blue-700 mb-2 sm:mb-6"
        />
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
        id="services"
        title="Services & Services"
        subheading="Solutions for all scenarios"
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4"
      >
        {services.map((service, index) => (
          <NumberedCard
            key={index}
            index={index}
            card={service}
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
