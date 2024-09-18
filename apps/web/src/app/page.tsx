import { LandingNav } from "@/components/landing/nav"
import { LandingFooter } from "@/components/landing/sections/footer"
import { FAQ } from "@/components/landing/sections/faq"
import { Hero } from "@/components/landing/sections/hero"
import { Benefits } from "@/components/landing/sections/benefits"
import { Features } from "@/components/landing/sections/features"
import { Services } from "@/components/landing/sections/services"


export default async function HomePage() {
  return (
    <>
      <LandingNav />
      <Hero />
      <Benefits />
      <Features />
      <Services />
      <FAQ />
      <LandingFooter />
    </>
  );
}