"use client";

import { MultiStepForm, Step } from "@/components/multistep-form";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@repo/ui/components/card";
import { FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@repo/ui/components/form";
import { Input } from "@repo/ui/components/input";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Business, Round, RoundTerm } from "@repo/sdk";
import { ComponentPropsWithoutRef, useRef, useState } from "react";
import { cn, formatCurrency, formatNumber } from "@/lib/utils";
import { Label } from "@repo/ui/components/label";
import Link from "next/link";
import { redirects } from "@/lib/config/redirects";
import { useAction } from "next-safe-action/hooks";
import { zCreateInvestmentParams } from "@repo/sdk/zod";
import { getSignatureAction } from "@/actions/terms";
import { TooltipContent, TooltipTrigger, Tooltip } from "@repo/ui/components/tooltip";
import { TooltipProvider } from "@repo/ui/components/tooltip";
import { Info } from "lucide-react";
import { useToast } from "@repo/ui/hooks/use-toast";
import { ToastAction } from "@repo/ui/components/toast";
import { redirect, usePathname } from "next/navigation";
import { getAccountAction, getSessionAction, getStripeIdentityAction } from "@/actions/auth";
import { createInvestmentAction } from "@/actions/investment";
import { RichTextDisplay } from "@/components/rich-text/rich-text-display";
import { VerifyIdentityModalButton } from "@/components/stipe/verify-identity-modal-button";
import { EmbeddedCheckoutForm, EmbeddedCheckoutFormRef } from "@/components/stipe/embedded-checkout";

type InvestFormValues = z.infer<typeof zCreateInvestmentParams>;

export interface InvestFormProps extends ComponentPropsWithoutRef<typeof Card> {
  round: Round;
  business: Business;
  terms: RoundTerm;
}

function BreakdownField({ label, value, tooltip }: { label: string, value: string, tooltip?: string }) {
  return (
    <div className="flex flex-col sm:flex-row justify-between sm:items-center">
      <span className="text-muted-foreground flex sm:flex-row-reverse items-center gap-1">
        <Tooltip>
          <TooltipTrigger type="button">
            <Info className="size-3.5 text-muted-foreground" />
          </TooltipTrigger>
          <TooltipContent>
            <p>{tooltip}</p>
          </TooltipContent>
        </Tooltip>
        {label}
      </span>
      <span className="font-medium">
        {value}
      </span>
    </div>
  )
}

export function InvestForm({ round, business, terms, className, ...props }: InvestFormProps) {
  const { toast } = useToast()
  const currentPath = usePathname()
  const embeddedCheckoutFormRef = useRef<EmbeddedCheckoutFormRef>(null);
  const [investmentId, setInvestmentId] = useState<number>(0);
  const totalSharesForSale = round.total_shares_for_sale;

  const form = useForm<InvestFormValues>({
    resolver: zodResolver(zCreateInvestmentParams.extend({
      investment: z.object({
        share_quantity: z.number().min(1).max(totalSharesForSale),
      }),
    })),
    defaultValues: {
      investment: {
        round_id: round.id,
        share_quantity: 1,
      },
      terms_acceptance: {
        accepted_at: "",
        ip_address: "",
        user_agent: "",
        terms_id: round.terms_id,
      },
    },
  });

  const { executeAsync: getSignature } = useAction(getSignatureAction, {
    onSuccess: (data) => {
      form.setValue("terms_acceptance.ip_address", data.data?.ipAddress ?? "");
      form.setValue("terms_acceptance.user_agent", data.data?.userAgent ?? "");
    },
  });

  const handleSubmit = async () => {
    return await embeddedCheckoutFormRef.current?.submitCheckout();
  };

  const cardProps = {
    className: cn("w-full max-h-[70vh] overflow-y-auto", className),
    ...props,
  }

  const subTotalFormatted = formatCurrency((round.price_per_share_usd_cents * form.watch("investment.share_quantity")) / 100, "USD", "en-US")

  const steps: Step<InvestFormValues>[] = [
    {
      fields: [],
      content: (
        <Card {...cardProps}>
          <CardHeader>
            <CardTitle>Invest in {business.display_name}</CardTitle>
            <CardDescription>
              Review the round details before proceeding with your investment
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <Label className="text-sm font-medium mb-4 text-muted-foreground">Round Description</Label>
            <RichTextDisplay content={round.description} />
          </CardContent>
          <CardFooter>
            <p className="text-xs text-muted-foreground">
              By proceeding, you agree to the <Link href={redirects.legal.terms} className="underline text-foreground">Terms of Service</Link> {" "}
              and <Link href={redirects.legal.privacy} className="underline text-foreground">Privacy Policy</Link>.
            </p>
          </CardFooter>
        </Card >
      ),
      nextButtonText: "Invest",
    },
    {
      fields: [],
      content: (
        <Card {...cardProps}>
          <CardHeader>
            <CardTitle>Accept Terms</CardTitle>
            <CardDescription>
              Review the round terms and conditions before proceeding with your investment
            </CardDescription>
          </CardHeader>
          <CardContent>
            <RichTextDisplay content={terms.content} />
          </CardContent>
          <CardFooter>
            <p className="text-xs text-muted-foreground">
              By proceeding, you agree to the <Link href={redirects.legal.terms} className="underline text-foreground">Terms of Service</Link> {" "}
              and <Link href={redirects.legal.privacy} className="underline text-foreground">Privacy Policy</Link>.
            </p>
          </CardFooter>
        </Card >
      ),
      nextButtonText: "Accept",
      onNext: async () => {
        const resp = await getSignature();
        if (resp?.data) {
          form.setValue("terms_acceptance.ip_address", resp.data.ipAddress);
          form.setValue("terms_acceptance.user_agent", resp.data.userAgent);
          form.setValue("terms_acceptance.accepted_at", new Date().toISOString());
        } else {
          toast({
            title: "Uh oh!",
            description: "Failed to get signature data",
            variant: "destructive",
            action: (
              <ToastAction
                altText="Retry"
                onClick={() => getSignature()}
              >
                Retry
              </ToastAction>
            )
          });
          return false
        }

      },
    },
    {
      nextButtonText: "Continue",
      fields: ["investment.share_quantity"],
      content: (
        <Card {...cardProps}>
          <CardHeader>
            <CardTitle>Investment Details</CardTitle>
            <CardDescription>Enter your investment amount</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <FormField
              control={form.control}
              name="investment.share_quantity"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Shares</FormLabel>
                  <FormDescription>
                    The amount of shares you would like to purchase
                  </FormDescription>
                  <FormControl>
                    <Input
                      type="number"
                      placeholder="Enter amount"
                      {...field}
                      min={1}
                      max={totalSharesForSale}
                      onChange={(e) => {
                        field.onChange(e.target.valueAsNumber);
                      }}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            {form.watch("investment.share_quantity") > 0 && (
              <div className="flex flex-col gap-4">
                <TooltipProvider>
                  <Card>
                    <CardHeader>
                      <CardTitle>Round Breakdown</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3 sm:space-y-2 text-sm">
                      <BreakdownField
                        label="Price per Share"
                        value={formatCurrency(round.price_per_share_usd_cents / 100, "USD", "en-US")}
                        tooltip="The cost to purchase one share of the business"
                      />
                      <BreakdownField
                        label="Business Shares Outstanding"
                        value={round.total_business_shares.toLocaleString()}
                        tooltip="Total number of shares issued by the business"
                      />
                      <BreakdownField
                        label="Shares for Sale"
                        value={round.total_shares_for_sale.toLocaleString()}
                        tooltip="Number of shares available for purchase in this round"
                      />
                      <BreakdownField
                        label="Post-Money Business Valuation"
                        value={formatCurrency(round.total_business_shares * round.price_per_share_usd_cents / 100, "USD", "en-US")}
                        tooltip="The total value of the business after this investment round"
                      />
                      <BreakdownField
                        label="Business Percentage For Sale"
                        value={formatNumber((round.total_shares_for_sale / round.total_business_shares) * 100, 1, 5, true, "en-US")}
                        tooltip="The percentage of the business that is being sold in this round, based on the number of shares you&apos;re purchasing. If a &quot;~&quot; is shown, it means the percentage is rounded to 5 significant digits."
                      />
                    </CardContent>
                  </Card>
                  <Card>
                    <CardHeader>
                      <CardTitle>Investment Breakdown</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3 sm:space-y-2 text-sm">
                      <BreakdownField
                        label="Total Cost"
                        value={subTotalFormatted}
                        tooltip="The total amount you&apos;ll pay for your shares."
                      />
                      <BreakdownField
                        label="Post-Money Ownership"
                        value={`${formatNumber(form.watch("investment.share_quantity") / round.total_business_shares, 1, 5, true, "en-US")}%`}
                        tooltip="Your percentage ownership of the business after this investment, based on the number of shares you&apos;re purchasing. If a &quot;~&quot; is shown, it means the percentage is rounded to 5 significant digits."
                      />
                      <BreakdownField
                        label="Shares of Round"
                        value={`${formatNumber((form.watch("investment.share_quantity") / round.total_shares_for_sale) * 100, 1, 5, true, "en-US")}%`}
                        tooltip="Your percentage of the total shares available in this round, based on the number of shares you&apos;re purchasing. If a &quot;~&quot; is shown, it means the percentage is rounded to 5 significant digits."
                      />
                    </CardContent>
                  </Card>
                </TooltipProvider>
              </div>
            )}
          </CardContent>
        </Card>
      ),
      onNext: async () => {
        const session = await getSessionAction();
        if (!session?.data) {
          redirect(redirects.auth.login + `?redirect=${currentPath}`);
        }

        const resp = await getAccountAction();
        if (!resp?.data) {
          redirect(redirects.auth.createAccount);
        }

        const identity = await getStripeIdentityAction();
        if (!identity?.data) {
          toast({
            title: "Hold on!",
            description: "We need you to log in and verify your identity before you can invest.",
            action: (
              <VerifyIdentityModalButton variant="secondary" size="sm" />
            )
          })

          return false
        }

        const investment = (await createInvestmentAction(form.getValues()))?.data;
        if (!investment) {
          toast({
            title: "Uh oh!",
            description: "Failed to create investment, please try again.",
            variant: "destructive",
          });
          return false
        }

        setInvestmentId(investment.id);
      },
      onBack: () => {
        form.setValue("terms_acceptance.accepted_at", "");
        form.setValue("terms_acceptance.ip_address", "");
        form.setValue("terms_acceptance.user_agent", "");
      },
    },
    {
      nextButtonText: "Pay",
      fields: [],
      content: (
        <Card {...cardProps}>
          <CardHeader>
            <CardTitle>Payment Details</CardTitle>
            <CardDescription>
              Enter your payment details to complete your investment. You can exit now and come back later to pay.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <p className="text-sm text-muted-foreground">
              You will be charged {subTotalFormatted} for your investment.
            </p>
            <EmbeddedCheckoutForm
              ref={embeddedCheckoutFormRef}
              amount={form.getValues("investment.share_quantity") * round.price_per_share_usd_cents}
              //TODO: get from locale
              currency="usd"
              investmentId={investmentId}
              onError={(error) => toast({
                title: "Uh oh!",
                description: error,
                variant: "destructive",
              })}
              onSuccess={() => {
                toast({
                  title: "Investment Successful",
                  description: "You have successfully invested in the round.",
                });
              }}
            />
          </CardContent>
        </Card>
      ),
    },

  ];

  return (
    <MultiStepForm
      form={form}
      steps={steps}
      handleSubmit={handleSubmit}
      className="gap-6"
    />
  );
}
