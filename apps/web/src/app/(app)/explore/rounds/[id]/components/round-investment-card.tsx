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
import { env } from "@/env";

export interface ConfirmInvestmentDialogProps extends ComponentPropsWithoutRef<typeof Dialog> {
  roundId: number;
  price?: number;
  buttonProps?: ComponentPropsWithoutRef<typeof Button>;
}

export const ConfirmInvestmentDialog: FC<ConfirmInvestmentDialogProps> = ({ roundId, price, buttonProps, ...props }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen} {...props}>
      <DialogTrigger asChild className="w-1/2">
        <Button className={cn("w-full", buttonProps?.className)} {...buttonProps}>
          Invest{price && ` for $${price}`}
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
  );
}

export interface RoundViewInvestmentCardProps extends ComponentPropsWithoutRef<typeof Card> {
  round: Round
  buttonProps?: ComponentPropsWithoutRef<typeof Button>;
};

export const MiniRoundViewInvestmentCard: FC<RoundViewInvestmentCardProps> = ({ className, round, buttonProps, ...props }) => {
  const buyInPrice = round.buyIn * (1 + env.NEXT_PUBLIC_FEE_PERCENTAGE);

  return (
    <div
      className={cn("w-full font-semibold py-2 px-4 sm:px-6 bg-background border-t", className)}
      {...props}
    >
      <ConfirmInvestmentDialog roundId={round.id} price={buyInPrice} buttonProps={buttonProps} />
    </div>
  );
};

export const RoundViewInvestmentCard: FC<RoundViewInvestmentCardProps> = ({ className, round, buttonProps, ...props }) => {
  const valuationAtPurchase = Math.round(round.percentageValue / (round.percentageOffered / 100));

  const perInvestorPercentage = (round.investorCount > 1 ? round.percentageOffered / round.investorCount : round.percentageOffered).toFixed(3);
  return (
    <Card className={cn("w-full h-full", className)} {...props}>
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
              ${(round.buyIn * (1 + env.NEXT_PUBLIC_FEE_PERCENTAGE)).toFixed(2)}
            </span>
          </div>
        </CardContent>
      </TooltipProvider>
      <CardFooter className="w-full mt-8">
        <ConfirmInvestmentDialog roundId={round.id} buttonProps={buttonProps} />
      </CardFooter>
    </Card>
  );
};

