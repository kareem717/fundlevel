import { Separator } from "@/components/ui/separator";
import { ConfirmationButton } from "./components/confirmation-button";
import { Label } from "@/components/ui/label";
import { faker } from "@faker-js/faker";
import Link from "next/link";
import { NavBack } from "@/components/nav-back";
import { Icons } from "@/components/ui/icons";
import { env } from "@/env";
import { CheckoutForm } from "./components/checkout-form";
import { getInvestmentByIdCached, getInvestmentPaymentIntentClientSecret } from "@/actions/investments";
import redirects from "@/lib/config/redirects";
import Image from "next/image";
import { Card } from "@/components/ui/card";
import { useMemo } from "react";

export default async function CompleteInvestmentPage({ params }: { params: Promise<{ id: string }> }) {
  const { id: investmentId } = await params;

  const parsedId = parseInt(investmentId);
  if (isNaN(parsedId)) {
    console.error("Invalid investment ID", investmentId);
    throw new Error("Invalid investment ID");
  }

  const investment = await getInvestmentByIdCached(parsedId);
  if (!investment?.data?.investment) {
    console.error("Investment not found", investmentId);
    throw new Error("Investment not found");
  }

  if (investment.data.investment.status !== "processing") {
    console.error("Investment is not processing", investmentId);
    throw new Error("Investment is not processing");
  }

  const clientSecret = await getInvestmentPaymentIntentClientSecret(parsedId);

  if (!clientSecret?.data?.clientSecret) {
    console.error("Client secret not found", clientSecret);
    throw new Error("Client secret not found");
  }

  const redirectUrl = useMemo(() => redirects.app.portfolio.investments.index, []);

  return (
    <div className="flex justify-center items-start relative py-24 px-8 gap-4">
      <NavBack size="icon">
        <Icons.chevronLeft className="size-10" />
      </NavBack>
      <div className="w-full max-w-screen-xl space-y-10">
        <h1 className="text-4xl font-bold">Complete your investment</h1>
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
                clientSecret={clientSecret.data.clientSecret}
                publishableKey={env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY}
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
            <ConfirmationButton className="w-full" prefetchUrl={redirectUrl} />
          </div>
          <Card className="flex flex-col gap-4 p-4 w-full min-w-[300px] max-w-md sticky top-14 right-0 h-min">
            <div className="flex justify-start items-center gap-4 w-full">
              <Image src="/filler.jpeg" alt="Investment Price Breakdown" width={100} height={100} className="rounded-md" />
              <div className="flex flex-col gap-1">
                <p className="font-medium text-lg">{investmentId}</p>
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
                  <span>${investment.data.investment?.round?.buyIn?.toFixed(2) ?? "N/A"} CAD</span>
                </div>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
