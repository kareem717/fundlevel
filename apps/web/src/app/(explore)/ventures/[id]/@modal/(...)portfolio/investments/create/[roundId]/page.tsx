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
import { faker } from "@faker-js/faker";
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
  if (isNaN(parsedId)) {
    console.error("Invalid round ID", roundId);
    throw new Error("Invalid round ID");
  }

  const { execute: getAccount, isExecuting: isAccountLoading } = useAction(getAccountCached, {
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
  });


  const { execute: getRound, isExecuting: isRoundLoading, ...rest } = useAction(getRoundById, {
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
  });

  useEffect(() => {
    getAccount();
    getRound(parsedId);
  }, [getAccount, getRound, parsedId]);

  if (isAccountLoading || isRoundLoading) {
    return (
      <Dialog
        open={true}
        onOpenChange={() => router.back()}
      >
        <DialogContent className="max-w-screen-xl min-h-[80vh]">
          <DialogHeader>
            <DialogTitle className="text-4xl">Complete your investment</DialogTitle>
          </DialogHeader>
          <div className="flex justify-center items-center h-full">
            <Icons.spinner className="size-10 animate-spin" />
          </div>
        </DialogContent>
      </Dialog>
    )
  }

  const redirectUrl = env.NEXT_PUBLIC_APP_URL + redirects.app.portfolio.investments.index;

  return (
    <Dialog
      open={true}
      onOpenChange={() => router.back()}
    >
      <DialogContent className="max-w-screen-xl">
        <DialogHeader>
          <DialogTitle className="text-4xl">Complete your investment</DialogTitle>
        </DialogHeader>
        <div className="flex flex-col-reverse md:flex-row gap-20 w-full">
          <div className="flex flex-col gap-4 w-full">
            <Label className="text-2xl" htmlFor="refund-policy">
              Your investment
            </Label>
            <div id="refund-policy">
              {faker.lorem.paragraphs(1)}{" "}
              <Link href="#" className="font-semibold underline">Learn more</Link>
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
              {faker.lorem.paragraphs(1)}{" "}
              <Link href="#" className="font-semibold underline">Learn more</Link>
            </div>
            <Separator className="my-4" />
            <Label className="text-2xl" htmlFor="refund-policy">
              Escrow policy
            </Label>
            <div id="refund-policy">
              {faker.lorem.paragraphs(1)}{" "}
              <Link href="#" className="font-semibold underline">Learn more</Link>
            </div>
            <Separator className="my-4" />
            <Label className="text-2xl" htmlFor="refund-policy">
              Refund policy
            </Label>
            <div id="refund-policy">
              {faker.lorem.paragraphs(1)}{" "}
              <Link href="#" className="font-semibold underline">Learn more</Link>
            </div>
            <Separator className="my-4" />
            <div className="flex flex-row gap-6">
              <Icons.calendar className="size-10" />
              <p>
                <span className="font-semibold">Your reservation won’t be confirmed until the Host accepts your request (within 24 hours).</span> You won’t be charged until then.
              </p>
            </div>
            <Separator className="my-4" />
            <CheckoutConfirmation className="w-full" prefetchUrl={redirectUrl} />
          </div>
          <Card className="flex flex-col gap-4 p-4 w-full min-w-[300px] max-w-md h-min">
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
                  <span>$337.00 CAD x 5 nights</span>
                  <span>$1,685.00 CAD</span>
                </div>
                <div className="flex justify-between">
                  <span>Cleaning fee</span>
                  <span>$65.00 CAD</span>
                </div>
                <div className="flex justify-between">
                  <span>Airbnb service fee</span>
                  <span>$279.18 CAD</span>
                </div>
                <div className="flex justify-between">
                  <span>Taxes</span>
                  <span>$227.50 CAD</span>
                </div>
                <Separator className="my-2" />
                <div className="flex justify-between font-bold">
                  <span>Total (CAD)</span>
                  {/*//TODO: handle better*/}
                  <span>${round?.buyIn?.toFixed(2) ?? "N/A"} CAD</span>
                </div>
              </div>
            </div>
          </Card>
        </div>
      </DialogContent>
    </Dialog>
  )
}
