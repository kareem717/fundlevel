"use client";

import { getAccountCached } from "@/actions/auth";
import { getRoundById } from "@/actions/rounds";
import { CheckoutConfirmation, CheckoutForm } from "@/components/forms/checkout-form";
import { Card } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Icons } from "@/components/ui/icons";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { env } from "@/env";
import { Round } from "@/lib/api";
import redirects from "@/lib/config/redirects";
import { formatCurrency } from "@/lib/utils";
import { faker } from "@faker-js/faker";
import { format } from "date-fns";
import { useAction } from "next-safe-action/hooks";
import Image from "next/image";
import Link from "next/link";
import { notFound, useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "sonner";

export default function InvestmentModal() {
  const { roundId } = useParams();
  const router = useRouter();
  const [round, setRound] = useState<Round>();
  const parsedId = parseInt(roundId as string);
  const [accountLoading, setAccountLoading] = useState(true);
  const [roundLoading, setRoundLoading] = useState(true);
  if (isNaN(parsedId)) {
    console.error("Invalid round ID", roundId);
    throw new Error("Invalid round ID");
  }

  const { execute: getAccount } = useAction(getAccountCached, {
    onExecute: () => setAccountLoading(true),
    onSuccess: (data) => {
      if (!data?.data) {
        //Todo: handle better
        router.push(redirects.auth.createAccount);
      }
    },
    onError: () => {
      toast.error("An error occurred while fetching your account.");
      router.back();
    },
    onSettled: () => setAccountLoading(false),
  });


  const { execute: getRound } = useAction(getRoundById, {
    onExecute: () => setRoundLoading(true),
    onSuccess: ({ data }) => {
      if (!data?.round) {
        notFound();
      }

      setRound(data.round);
    },
    onError: () => {
      toast.error("An error occurred while fetching the round.");
      router.back();
    },
    onSettled: () => setRoundLoading(false),
  });

  useEffect(() => {
    getAccount();
    getRound(parsedId);
  }, [getAccount, getRound, parsedId]);

  if (accountLoading || roundLoading) {
    return (
      <Dialog
        open={true}
        onOpenChange={() => router.back()}
      >
        <DialogContent className="max-w-screen-xl">
          <DialogHeader>
            <DialogTitle className="text-4xl">Complete your investment</DialogTitle>
          </DialogHeader>
          <div className="flex justify-center items-center h-full py-10">
            <Icons.spinner className="size-10 animate-spin text-muted-foreground" />
          </div>
        </DialogContent>
      </Dialog>
    )
  }

  if (!round) {
    notFound();
  }

  const redirectUrl = env.NEXT_PUBLIC_APP_URL + redirects.app.portfolio.investments.history;

  //todo: localize
  const valuation = formatCurrency(round.percentageValue / (round.percentageOffered / 100), round.valueCurrency);
  const serviceFee = formatCurrency(round.buyIn * 0.03, round.valueCurrency);
  const taxes = formatCurrency((round.buyIn * 1.03) * 0.13, round.valueCurrency);
  const total = formatCurrency((round.buyIn * 1.03) * 1.13, round.valueCurrency);
  return (
    <Dialog
      open={true}
      onOpenChange={() => router.back()}
    >
      <DialogContent className="max-w-screen-xl">
        <DialogHeader>
          <DialogTitle className="text-4xl">Complete your investment</DialogTitle>
        </DialogHeader>
        <div className="flex flex-col-reverse md:flex-row gap-20 w-full max-h-[70dvh] overflow-y-auto relative px-2">
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
            {/* <div className="flex flex-row gap-6">
              <Icons.calendar className="size-10" />
              <p>
                <span className="font-semibold">
                  Your reservation won’t be confirmed until the Host accepts your request (within 24 hours).
                </span>{" "}
                You won’t be charged until then.
              </p>
            </div> */}
            {/* <Separator className="my-4" /> */}
            <CheckoutConfirmation
              className="w-full"
              prefetchUrl={redirectUrl}
              confirmationDisclaimer={(
                <p>
                  By pressing this button, you agree to the <Link href="#" className="font-semibold underline">investment agreement</Link>, <Link href="#" className="font-semibold underline">Fundlevel's terms of service</Link>, and the <Link href="#" className="font-semibold underline">payment policy</Link>. You agree to pay the total amount shown if the investment goes through.
                </p>
              )}
            />
          </div>
          <Card className="flex flex-col gap-4 p-4 w-full min-w-[300px] max-w-md h-min sticky top-0">
            <div className="flex justify-start items-center gap-4 w-full">
              <Image src="/filler.jpeg" alt="Investment Price Breakdown" width={100} height={100} className="rounded-md" />
              <div className="flex flex-col gap-1">
                <p className="font-medium text-lg">{roundId}</p>
                <p className="text-sm text-muted-foreground">description</p>
                {/* <p className="text-sm text-muted-foreground flex items-center gap-1"><Icons.star className="size-4 inline-block fill-current" /> 4.94 (199 reviews) • Superhost</p> */}
              </div>
            </div>
            <Separator className="my-4" />
            <div className="flex flex-col gap-2">
              <Label className="text-2xl font-medium" htmlFor="price-details">Price details</Label>
              <div id="price-details" className="flex flex-col gap-2">
                <div className="flex justify-between">
                  <span>{valuation} x {round.percentageOffered}%</span>
                  <span>{formatCurrency(round.buyIn, round.valueCurrency)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Service fee</span>
                  <span>{serviceFee}</span>
                </div>
                <div className="flex justify-between">
                  <span>Taxes</span>
                  <span>{taxes}</span>
                </div>
                <Separator className="my-2" />
                <div className="flex justify-between font-bold">
                  <span>Total</span>
                  <span>{total}</span>
                </div>
              </div>
            </div>
          </Card>
        </div>
      </DialogContent>
    </Dialog>
  )
}
