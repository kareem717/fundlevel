import { RoundViewHero } from "@/components/app/rounds/view/hero"
import { RoundViewDetails } from "@/components/app/rounds/view/details"
import { faker } from "@faker-js/faker";
import { RoundViewInvestmentCard, MiniRoundViewInvestmentCard } from "@/components/app/rounds/view/investment-card";
import { ScrollArea } from "@/components/ui/scroll-area";

export default function RoundViewPage() {
  const images = Array.from({ length: 15 }).map((_, index) => `/filler.jpeg`);

  return (
    <div className="h-full max-h-screen w-full relative">
      <ScrollArea className="h-full w-full pb-20 sm:pb-6 lg:pb-0">
        <div className="w-full h-full flex flex-col md:grid grid-cols-1 md:grid-cols-3 grid-rows-3 gap-4 ">
          <RoundViewHero name="Round Name" images={images} className="md:col-span-3" />
          <RoundViewDetails
            className="md:col-span-2 row-span-2"
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
          <RoundViewInvestmentCard purchasePercentage={12.5} purchasePrice={100000} currency={'USD'} className="hidden md:block h-min" roundId={1} price={100000} />
        </div>
      </ScrollArea>
      <MiniRoundViewInvestmentCard
        purchasePercentage={12.5}
        purchasePrice={100000}
        currency={'USD'}
        className="md:hidden bottom-0 left-0 right-0 fixed"
        roundId={1}
        price={100000}
      />
    </div>
  )
}