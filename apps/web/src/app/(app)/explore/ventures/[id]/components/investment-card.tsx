"use client"

import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { cn } from "@/lib/utils";
import { ComponentPropsWithoutRef, FC, useState } from "react"
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { CreateInvestmentButton } from "@/components/ui/create-investment-button";
import { Round } from "@/lib/api";

export interface MiniRoundViewInvestmentCardProps extends ComponentPropsWithoutRef<typeof Card> {
  roundId: number;
};

export const MiniRoundViewInvestmentCard: FC<MiniRoundViewInvestmentCardProps> = ({ className, roundId, ...props }) => {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <div
      className={cn("flex flex-row justify-between items-center w-full font-semibold py-2 px-4 sm:px-6 bg-background border-t", className)}
      {...props}
    >
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogTrigger asChild className="w-1/2">
          <Button className="w-full">
            Invest
          </Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirm Investment</DialogTitle>
            <DialogDescription>
              This will begin the investment process. If your investment offer is accepted, you will be able to complete the payment.
            </DialogDescription>
          </DialogHeader>
          <CreateInvestmentButton roundId={roundId} onSuccess={() => setIsOpen(false)} />
        </DialogContent>
      </Dialog>
    </div>
  );
};

export interface RoundViewInvestmentCardProps extends ComponentPropsWithoutRef<typeof Card> {
  round: Round;
};

export const RoundViewInvestmentCard: FC<RoundViewInvestmentCardProps> = ({ className, round, ...props }) => {
  const valuationAtPurchase = Math.round(round.percentageValue / (round.percentageOffered / 100));
  const [isOpen, setIsOpen] = useState(false);

  return (
    <Card className={cn("w-full", className)} {...props}>
      <CardHeader>
        <CardTitle>Invest for {round.percentageOffered}%</CardTitle>
      </CardHeader>
      <TooltipProvider>
        <CardContent className="bg-secondary mx-6 rounded-md flex flex-col items-center justify-center py-4">
          <span className="font-semibold mb-6">
            Breakdown
          </span>
          <div className="flex flex-row justify-between items-center w-full">
            <Tooltip>
              <TooltipTrigger className="hover:underline">
                Current valuation:
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
              <TooltipTrigger className="hover:underline">
                Percentage purchased:
              </TooltipTrigger>
              <TooltipContent>
                <p>The percentage of the round that you are investing in</p>
              </TooltipContent>
            </Tooltip>
            <span className="font-semibold">
              {round.percentageOffered}%
            </span>
          </div>
          <Separator className="w-full bg-foreground my-2" />
          <div className="flex flex-row justify-between items-center w-full font-semibold">
            <Tooltip>
              <TooltipTrigger className="hover:underline">
                Total
              </TooltipTrigger>
              <TooltipContent>
                This is your buy in price, calculated as {round.percentageOffered}% of ${valuationAtPurchase}
              </TooltipContent>
            </Tooltip>
            <span>
              {/* //TODO: localize currency symbol */}
              ${round.buyIn}
            </span>
          </div>
        </CardContent>
      </TooltipProvider>
      <CardFooter className="w-full mt-8">
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
          <DialogTrigger asChild className="w-1/2">
            <Button className="w-full">
              Invest
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Confirm Investment</DialogTitle>
              <DialogDescription>
                This will begin the investment process. If your investment offer is accepted, you will be able to complete the payment.
              </DialogDescription>
            </DialogHeader>
            <CreateInvestmentButton roundId={round.id} onSuccess={() => setIsOpen(false)} />
          </DialogContent>
        </Dialog>
      </CardFooter>
    </Card>
  );
};

