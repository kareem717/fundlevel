import { LandingNav } from "@/app/(landing)/components/nav"
import { LandingFooter } from "@/app/(landing)/components/sections/footer"
import { FAQ } from "@/app/(landing)/components/sections/faq"
import { Hero } from "@/app/(landing)/components/sections/hero"
import { Benefits } from "@/app/(landing)/components/sections/benefits"
import { Features } from "@/app/(landing)/components/sections/features"
import { Services } from "@/app/(landing)/components/sections/services"


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