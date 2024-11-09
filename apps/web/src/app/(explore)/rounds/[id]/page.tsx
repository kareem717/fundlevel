import { RoundViewActions } from "./components/round-view-actions"
import { ConfirmInvestmentDialog } from "./components/confirm-investment-dialog";
import { getRoundById, isRoundLiked } from "@/actions/rounds";
import { notFound } from "next/navigation";
import { getAccount } from "@/actions/auth";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Icons } from "@/components/ui/icons";
import { Separator } from "@/components/ui/separator";
import { cn, toFixedRound, truncateText } from "@/lib/utils";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import { env } from "@/env";
import { BusinessOverview } from "@/components/business-overview";

export default async function RoundViewPage(props: { params: Promise<{ id: string }> }) {
  const params = await props.params;
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
    isLiked = isLikedResp?.data?.favourited ?? false;
  }

  const valuationAtPurchase = Math.round(round.percentageValue / (round.percentageOffered / 100));
  const perInvestorPercentage = toFixedRound(round.investorCount > 1 ? round.percentageOffered / round.investorCount : round.percentageOffered, 3);
  const buyInPrice = toFixedRound(round.buyIn * (1 + env.NEXT_PUBLIC_FEE_PERCENTAGE), 2);

  return (
    <Card className="w-full relative max-w-screen-lg mx-auto">
      <CardHeader>
        <CardTitle className="flex flex-row items-center justify-between w-full">
          Round for {venture.name}
          <RoundViewActions roundId={round.id} isLiked={isLiked} />
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
              By {business.name}
            </div>
            <Separator className="w-full" />
            <span className="text-lg font-semibold">Business Details</span>
            <BusinessOverview
              overview={venture.overview}
              teamSize={business.teamSize}
              businessId={business.id}
            />
            <Separator className="w-full" />
            <span className="text-lg font-semibold">Round Description</span>
            <div className="flex flex-col items-start justify-start">
              <p>
                {truncateText(venture.description, 350)}
              </p>
              {venture.description.length > 150 && (
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
                          {round.description}
                        </ScrollArea>
                      </div>
                    </DialogContent>
                  </div>
                </Dialog>
              )}
            </div>
          </div>
          <Card className={cn("w-full h-full hidden md:block lg:w-1/3")}>
            <CardHeader>
              <CardTitle>Own {perInvestorPercentage}%</CardTitle>
            </CardHeader>
            <TooltipProvider>
              <CardContent className="bg-secondary mx-6 rounded-md flex flex-col items-center justify-center py-4 h-full">
                <span className="font-semibold mb-6">
                  Breakdown
                </span>
                <div className="flex flex-row justify-between items-center w-full">
                  <Tooltip>
                    <TooltipTrigger className="hover:underline text-left">
                      Valuation:
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>The valuation of the venture at your current purchase price</p>
                    </TooltipContent>
                  </Tooltip>
                  <span className="font-semibold">
                    ${valuationAtPurchase}
                  </span>
                </div>
                <div className="flex flex-row justify-between items-center w-full">
                  <Tooltip>
                    <TooltipTrigger className="hover:underline text-left">
                      Percentage:
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>The venture is offering a total of {round.percentageOffered}%
                        {round.investorCount > 1 && `, divided between ${round.investorCount} investors`}
                      </p>
                    </TooltipContent>
                  </Tooltip>
                  <span className="font-semibold">
                    {perInvestorPercentage}%
                  </span>
                </div>
                <div className="flex flex-row justify-between items-center w-full">
                  <Tooltip>
                    <TooltipTrigger className="hover:underline text-left">
                      Buy in:
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>This is the cost for the percentage of the round that you want to buy at the current valuation</p>
                    </TooltipContent>
                  </Tooltip>
                  <span className="font-semibold">
                    ${round.buyIn}
                  </span>
                </div>
                <div className="flex flex-row justify-between items-center w-full">
                  <Tooltip>
                    <TooltipTrigger className="hover:underline text-left">
                      Fees:
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>This is the fee we charge to support Fundlevel</p>
                    </TooltipContent>
                  </Tooltip>
                  <span className="font-semibold">
                    ${(round.buyIn * env.NEXT_PUBLIC_FEE_PERCENTAGE).toFixed(2)}
                  </span>
                </div>
                <Separator className="w-full bg-foreground my-2" />
                <div className="flex flex-row justify-between items-center w-full font-semibold">
                  <Tooltip>
                    <TooltipTrigger className="hover:underline text-left">
                      Total
                    </TooltipTrigger>
                    <TooltipContent>
                      This is your buy in price, calculated as {round.percentageOffered}% of ${valuationAtPurchase}
                    </TooltipContent>
                  </Tooltip>
                  <span>
                    {/* //TODO: localize currency symbol */}
                    ${buyInPrice}
                  </span>
                </div>
              </CardContent>
            </TooltipProvider>
            <CardFooter className="w-full mt-8">
              <ConfirmInvestmentDialog roundId={round.id} />
            </CardFooter>
          </Card>
        </div>
      </CardContent>
      <div
        className={cn("w-full font-semibold py-2 px-4 sm:px-6 bg-background border-t md:hidden bottom-0 left-0 right-0 fixed")}
      >
        <ConfirmInvestmentDialog roundId={round.id} price={parseFloat(buyInPrice)} />
      </div>
    </Card>
  )
}