"use client";

import { CheckoutConfirmation, CheckoutForm } from "@/components/forms/checkout-form";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { VentureRound } from "@/lib/api";
import { cn, formatCurrency } from "@/lib/utils";
import { TooltipProvider, Tooltip, TooltipTrigger, TooltipContent } from "@/components/ui/tooltip";
import { format } from "date-fns";
import Link from "next/link";
import { FC, ComponentPropsWithoutRef } from "react";
import { parseAsBoolean, useQueryState } from "nuqs";

interface InvestmentDialogProps extends ComponentPropsWithoutRef<typeof DialogContent> {
  round: VentureRound;
  triggerProps?: ComponentPropsWithoutRef<typeof Button>;
  redirectUrl: string;
}

export const InvestmentDialog: FC<InvestmentDialogProps> = ({ round, className, triggerProps, redirectUrl, ...props }) => {
  //todo: localize
  const [open, setOpen] = useQueryState("invest", parseAsBoolean.withDefault(false));

  const valuation = formatCurrency(round.percentageValue / (round.percentageOffered / 100), round.valueCurrency);
  const serviceFee = formatCurrency(round.buyIn * 0.03, round.valueCurrency);
  const total = formatCurrency(round.buyIn * 1.03, round.valueCurrency);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild {...triggerProps}>
        <Button {...triggerProps}>Invest</Button>
      </DialogTrigger>
      <DialogContent className={cn("max-w-screen-xl", className)} {...props}>
        <DialogHeader>
          <DialogTitle className="text-4xl">Complete your investment</DialogTitle>
        </DialogHeader>
        <div className="flex flex-col-reverse md:flex-row gap-20 w-full max-h-[70dvh] overflow-y-auto relative px-2 py-4">
      <div className="flex flex-col gap-4 w-full">
        <Label className="text-2xl" htmlFor="refund-policy">
          Your investment
        </Label>
        <div id="refund-policy">
          You recieve {round.percentageOffered}% of this venture's profits for the next 16 months.{" "}
          <Link href="#" className="font-semibold underline">Learn more</Link>.
        </div>
        <Separator className="my-4" />
        <Label className="text-2xl" htmlFor="refund-policy">
          Pay with
        </Label>
        <div id="refund-policy">
          <CheckoutForm
            roundId={round?.id ?? 0}
            confirmParams={{
              return_url: redirectUrl,
            }}
          />
        </div>
        <Separator className="my-4" />
        <Label className="text-2xl" htmlFor="refund-policy">
          Refund policy
        </Label>
        <div id="refund-policy">
          You can get a partial refund for this investment if you request one before {format(new Date(new Date().setDate(new Date().getDate() + 5)), "PPP")}. After that, your refund depends on when you cancel.{" "}
          <Link href="#" className="font-semibold underline">Learn more</Link>.
        </div>
        <Separator className="my-4" />
        <CheckoutConfirmation
          className="w-full"
          prefetchUrl={redirectUrl}
          confirmationDisclaimer={(
            <>
              {/* //todo: replace with real links */}
              By pressing this button, you agree to the <Link href="#" className="font-semibold underline">investment agreement</Link>, <Link href="#" className="font-semibold underline">Fundlevel's terms of service</Link>, and the <Link href="#" className="font-semibold underline">payment policy</Link>. You agree to pay the total amount shown if the investment goes through.
            </>
          )}
        />
      </div>
      <Card className="flex flex-col gap-4 p-4 w-full min-w-[300px] max-w-md h-min sticky top-0">
        {/* //TODO add images and title */}
        {/* <div className="flex justify-start items-center gap-4 w-full">
              <Image src="/filler.jpeg" alt="Investment Price Breakdown" width={100} height={100} className="rounded-md" />
              <div className="flex flex-col gap-1">
                <p className="font-medium text-lg">{round.id}</p>
                <p className="text-sm text-muted-foreground">description</p>
              </div>
            </div>
            <Separator className="my-4" /> */}
        <div className="flex flex-col gap-2">
          <Label className="text-2xl font-medium" htmlFor="price-details">Price details</Label>
          <div id="price-details" className="flex flex-col gap-2">
            <div className="flex justify-between">
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <span>
                          <span className="hover:underline hover:cursor-pointer hover:text-foreground inline">{valuation}</span>
                          <span className="inline ml-1">x {round.percentageOffered}%</span>
                        </span>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>This is a valuation of the round</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                  <span>{formatCurrency(round.buyIn, round.valueCurrency)}</span>
                </div >
                <div className="flex justify-between">
                  <span>Service fee</span>
                  <span>{serviceFee}</span>
                </div>
                <Separator className="my-2" />
                <div className="flex justify-between font-bold">
                  <span>Total</span>
                  <span>{total}</span>
                </div>
              </div >
            </div >
          </Card >
        </div >
      </DialogContent >
    </Dialog >
  )
}