import { RoundViewActions } from "./components/round-view-actions"
import { faker } from "@faker-js/faker";
import { RoundViewInvestmentCard, MiniRoundViewInvestmentCard } from "./components/round-investment-card";
import { getRoundById, isRoundLiked } from "@/actions/rounds";
import { notFound } from "next/navigation";
import { getAccount } from "@/actions/auth";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";
import { Icons } from "@/components/ui/icons";
import { Separator } from "@/components/ui/separator";

export default async function RoundViewPage({ params }: { params: { id: string } }) {
  const parsedId = parseInt(params.id as string || ""); // Parse the id
  if (isNaN(parsedId)) {
    notFound();
  }

  const roundResp = await getRoundById(parsedId)
  if (!roundResp?.data || roundResp?.serverError) {
    console.error(roundResp)
    throw new Error("Something went wrong")
  }

  const { venture: { business, ...venture }, ...round } = roundResp.data.round

  const accountResp = await getAccount();
  const account = accountResp?.data;

  let isLiked = false;
  if (account) {
    const isLikedResp = await isRoundLiked(round.id);
    isLiked = isLikedResp?.data?.liked ?? false;
  }

  const truncate = (text: string, maxLength: number) => {
    if (text.length > maxLength) {
      return text.substring(0, maxLength) + "...";
    }
    return text;
  };

  const description = venture.description

  const isLargeDescription = description.length > 150;
  return (
    <Card className="w-full relative max-w-screen-lg mx-auto">
      <CardHeader>
        <CardTitle className="flex flex-row items-center justify-between w-full">
          Round for {venture.name}
          <RoundViewActions className="w-full" roundId={round.id} isLiked={isLiked} isLoggedIn={!!account} />
        </CardTitle>
        <CardDescription>
          <span className="text-muted-foreground text-sm font-normal">
            Seeking {round.percentageValue} for {round.percentageOffered} through {round.investorCount} investors{round.investorCount > 1 ? "s" : ""}
          </span>
        </CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col gap-8 ">
        <div className="w-full flex flex-col lg:flex-row gap-4 h-full">
          <div className={cn("w-full flex flex-col px-2 lg:w-2/3 gap-4")}>
            <div className="flex flex-col gap-1 font-semibold">
              Lead by {business.name}
              <span className="text-muted-foreground text-xs font-normal">
                {/* {roundLead.title} - {roundLead.description} */}
              </span>
            </div>
            <Separator className="w-full" />
            <div className="flex flex-col gap-8 items-start justify-center">
              <div className="flex gap-4 items-center justify-start">
                <Icons.building className="w-9 h-9 text-muted-foreground" />
                <div className="flex flex-col gap-1">
                  Company Overview
                  <span className="text-muted-foreground">
                    {venture.overview}
                  </span>
                </div>
              </div>
              <div className="flex gap-4 items-center justify-start">
                <Icons.users className="w-9 h-9 text-muted-foreground" />
                <div className="flex flex-col gap-1">
                  Team Size
                  <span className="text-muted-foreground">
                    {business.teamSize}
                  </span>
                </div>
              </div>
              {/* <div className="flex gap-4 items-center justify-start">
                <Icons.briefcase className="w-9 h-9 text-muted-foreground" />
                <div className="flex flex-col gap-1">
                  Previous funding
                  <span className="text-muted-foreground">
                    {ventureDetails.previousFunding}
                  </span>
                </div>
              </div> */}
            </div>
            <Separator className="w-full" />
            <div className="flex flex-col items-start justify-start">
              <p>
                {truncate(description, 350)}
              </p>
              {isLargeDescription && (
                <Dialog>
                  <DialogTrigger asChild>
                    <Button variant="outline" size="sm" className="mt-4">
                      <span className="text-xs underline">
                        Show more
                      </span>
                      <Icons.chevronRight className="w-4 h-4 ml-2" />
                    </Button>
                  </DialogTrigger>
                  <div className="max-w-screen-lg px-2">
                    <DialogContent className="rounded-md">
                      <DialogHeader>
                        <DialogTitle> Round Description</DialogTitle>
                      </DialogHeader>
                      <div className="max-h-[70dvh] w-full h-full">
                        <ScrollArea className="h-full w-full">
                          {description}
                        </ScrollArea>
                      </div>
                    </DialogContent>
                  </div>
                </Dialog>
              )}
            </div>
          </div>
          <RoundViewInvestmentCard round={{
            ...round,
            venture: {
              ...venture,
              business
            }
          }} className="hidden md:block lg:w-1/3" />
        </div>
      </CardContent>
      <MiniRoundViewInvestmentCard
        round={{
          ...round,
          venture: {
            ...venture,
            business
          }
        }}
        className="md:hidden bottom-0 left-0 right-0 fixed"
      />
    </Card>
  )
}