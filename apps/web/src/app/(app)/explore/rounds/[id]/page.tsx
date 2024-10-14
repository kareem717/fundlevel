"use client"

import { RoundViewHero } from "@/components/app/rounds/view/hero"
import { RoundViewDetails } from "@/components/app/rounds/view/details"
import { faker } from "@faker-js/faker";
import { RoundViewInvestmentCard, MiniRoundViewInvestmentCard } from "@/components/app/rounds/view/investment-card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { getRoundById } from "@/actions/rounds";
import { notFound, useParams, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { RoundWithSubtypes } from "@/lib/api";
import { useAction } from "next-safe-action/hooks";
import { toast } from "sonner";

export default function RoundViewPage() {
  const { id } = useParams(); // Destructure id from useParams
  const parsedId = parseInt(id as string || ""); // Parse the id
  if (isNaN(parsedId)) {
    notFound();
  }

  const images = Array.from({ length: 15 }).map((_, index) => `/filler.jpeg`);

  const [data, setData] = useState<RoundWithSubtypes | undefined>(undefined);

  const { execute } = useAction(getRoundById, {
    onSuccess: ({ data }) => {
      setData(data?.round);
    },
    onError: ({ error }) => {
      console.error(error);
      toast.error("Something went wrong");
    }
  });

  useEffect(() => {
    execute(parsedId);
  }, []);

  if (!data) {
    return <div>Loading...</div>;
  }

  return (
    <div className="h-full max-h-screen w-full relative">
      <ScrollArea className="h-full w-full pb-20 sm:pb-6 lg:pb-0">
        <div className="w-full h-full flex flex-col md:grid grid-cols-1 md:grid-cols-3 grid-rows-3 gap-4 ">
          <RoundViewHero name={data.id.toString()} images={images} className="md:col-span-3" />
          <RoundViewDetails
            className="md:col-span-2 row-span-2"
            basicDetails={{
              location: `${data.status} San Francisco, USA`,
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