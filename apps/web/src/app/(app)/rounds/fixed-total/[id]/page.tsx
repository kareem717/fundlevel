import { RoundViewHero } from "@/components/app/rounds/view/hero"
import { RoundViewDetails } from "@/components/app/rounds/view/details"
import { faker } from "@faker-js/faker";
import { RoundViewInvestmentCard } from "@/components/app/rounds/view/investment-card";
import Link from "next/link";
export default function RoundViewPage() {
  const images = Array.from({ length: 15 }).map((_, index) => `/filler.jpeg`);

  return (
    <div className="w-full h-full grid grid-cols-3 grid-rows-3 gap-4">
      <RoundViewHero name="Round Name" images={images} className="col-span-3" />
      <RoundViewDetails
        className="col-span-2 row-span-2"
        basicDetails={{
          location: "San Francisco, USA",
          amountSeeking: "$100k",
          industry: "Tech Industry",
          focus: "AI/ML Focus"
        }}
        roundLead={{
          name: "John Doe",
          title: "Founder",
          description: "10 years in tech"
        }}
        ventureDetails={{
          overview: "AI-driven solutions for healthcare",
          team: "10 full-time employees",
          previousFunding: "$10M round in 2022"
        }}
        description={faker.lorem.paragraph({ min: 1000, max: 2000 })}
      />
      <div className="flex flex-col gap-4 row-span-2">
        <RoundViewInvestmentCard purchasePercentage={12.5} purchasePrice={100000} currency={'USD'} />
        <Link href={`#`} className="text-sm text-muted-foreground underline mx-auto">
          Report this listing
        </Link>
      </div>
    </div>
  )
}