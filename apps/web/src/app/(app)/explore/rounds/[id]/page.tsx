import { RoundViewHero } from "@/app/(app)/explore/rounds/[id]/components/round-hero"
import { RoundViewDetails } from "@/app/(app)/explore/rounds/[id]/components/round-details"
import { faker } from "@faker-js/faker";
import { RoundViewInvestmentCard, MiniRoundViewInvestmentCard } from "@/app/(app)/explore/rounds/[id]/components/round-investment-card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { getRoundById } from "@/actions/rounds";
import { notFound } from "next/navigation";

export default async function RoundViewPage({ params }: { params: { id: string } }) {
  const parsedId = parseInt(params.id as string || ""); // Parse the id
  if (isNaN(parsedId)) {
    notFound();
  }

  const images = Array.from({ length: 15 }).map((_, index) => `/filler.jpeg`);

  const roundResp = await getRoundById(parsedId)
  if (!roundResp?.data || roundResp?.serverError) {
    console.error(roundResp)
    throw new Error("Something went wrong")
  }

  const round = roundResp.data.round

  return (
    <div className="h-full max-h-screen w-full relative">
      <ScrollArea className="h-full w-full pb-20 sm:pb-6 lg:pb-0">
        <div className="w-full h-full flex flex-col md:grid grid-cols-1 md:grid-cols-3 grid-rows-3 gap-4 ">
          <RoundViewHero name={round.id.toString()} images={images} className="md:col-span-3" />
          <RoundViewDetails
            className="md:col-span-2 row-span-2"
            basicDetails={{
              location: `${round.status} San Francisco, USA`,
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