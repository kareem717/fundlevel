import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { cn } from "@/lib/utils";
import { ComponentPropsWithoutRef, FC } from "react"
import { buttonVariants } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import Link from "next/link";

export interface RoundViewInvestmentCardProps extends ComponentPropsWithoutRef<typeof Card> {
  purchasePercentage: number;
  purchasePrice: number;
  currency: string;
};

export const MiniRoundViewInvestmentCard: FC<RoundViewInvestmentCardProps> = ({ className, purchasePercentage, purchasePrice, currency, ...props }) => {

  return (
    <div
      className={cn("flex flex-row justify-between items-center w-full font-semibold py-2 px-4 sm:px-6 bg-background border-t", className)}
      {...props}
    >
      <span>
        {/* //TODO: localize currency symbol */}
        ${purchasePrice}
      </span>
      <Link href={`#`} className={cn(buttonVariants(), "w-1/2")}>
        Invest
      </Link>
    </div>
  );
};

export const RoundViewInvestmentCard: FC<RoundViewInvestmentCardProps> = ({ className, purchasePercentage, purchasePrice, currency, ...props }) => {
  const valuationAtPurchase = Math.round(purchasePrice / (purchasePercentage / 100));

  return (
    <Card className={cn("w-full", className)} {...props}>
      <CardHeader>
        <CardTitle>Invest for {purchasePercentage}%</CardTitle>
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
              {purchasePercentage}%
            </span>
          </div>
          <Separator className="w-full bg-foreground my-2" />
          <div className="flex flex-row justify-between items-center w-full font-semibold">
            <Tooltip>
              <TooltipTrigger className="hover:underline">
                Total
              </TooltipTrigger>
              <TooltipContent>
                This is your buy in price, calculated as {purchasePercentage}% of ${valuationAtPurchase}
              </TooltipContent>
            </Tooltip>
            <span>
              {/* //TODO: localize currency symbol */}
              ${purchasePrice}
            </span>
          </div>
        </CardContent>
      </TooltipProvider>
      <CardFooter className="w-full mt-8">
        <Link href={`#`} className={cn(buttonVariants(), "w-full")}>
          Invest
        </Link>
      </CardFooter>
    </Card>
  );
};

