"use client";

import { MultiStepForm, Step } from "@/components/forms/multistep-form";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@repo/ui/components/card";
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "@repo/ui/components/form";
import { Input } from "@repo/ui/components/input";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Business, Round } from "@repo/sdk";
import { ComponentPropsWithoutRef } from "react";
import { cn } from "@/lib/utils";
import { Label } from "@repo/ui/components/label";
import Link from "next/link";
import { redirects } from "@/lib/config/redirects";
import { useAction } from "next-safe-action/hooks";
import { zCreateInvestmentParams } from "@repo/sdk/zod";
import { getSignatureAction } from "@/actions/terms";

type InvestFormValues = z.infer<typeof zCreateInvestmentParams>;

export interface InvestFormProps extends ComponentPropsWithoutRef<typeof Card> {
  round: Round;
  business: Business;
}

export function InvestForm({ round, business, className, ...props }: InvestFormProps) {
  const form = useForm<InvestFormValues>({
    resolver: zodResolver(zCreateInvestmentParams),
    defaultValues: {
      investment: {
        round_id: round.id,
        share_quantity: 0,
      },
      terms_acceptance: {
        accepted_at: "",
        ip_address: "",
        user_agent: "",
        terms_id: round.terms_id,
      },
    },
  });

  const { executeAsync: getSignature, isExecuting: getSignatureIsExecuting } = useAction(getSignatureAction, {
    onSuccess: (data) => {
      form.setValue("terms_acceptance.ip_address", data.data?.ipAddress ?? "");
      form.setValue("terms_acceptance.user_agent", data.data?.userAgent ?? "");
    },
  });
  const handleSubmit = async (data: InvestFormValues) => {
    // Handle form submission
    console.log(data);
  };

  const cardProps = {
    className: cn("w-full", className),
    ...props,
  }

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
          <CardContent>
            <Label className="text-sm font-medium mb-4 text-muted-foreground">Round Description</Label>
            <p>{round.description}</p>
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
            <p>TODO: fetch terms and conditions from round</p>
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
      onNext: async () => {
        const resp = await getSignature();
        if (resp?.data) {
          form.setValue("terms_acceptance.ip_address", resp.data.ipAddress);
          form.setValue("terms_acceptance.user_agent", resp.data.userAgent);
          form.setValue("terms_acceptance.accepted_at", new Date().toISOString());
        } else {
          return "Failed to get signature data";
        }

        console.log(form.getValues());
      },
    },
    {
      fields: ["investment.share_quantity"],
      content: (
        <Card {...cardProps}>
          <CardHeader>
            <CardTitle>Investment Details</CardTitle>
            <CardDescription>Enter your investment amount</CardDescription>
          </CardHeader>
          <CardContent>
            <FormField
              control={form.control}
              name="investment.share_quantity"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Shares</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      placeholder="Enter amount"
                      {...field}
                      onChange={(e) => {
                        field.onChange(e.target.valueAsNumber);
                      }}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </CardContent>
        </Card>
      ),
      onBack: () => {
        form.setValue("terms_acceptance.accepted_at", "");
        form.setValue("terms_acceptance.ip_address", "");
        form.setValue("terms_acceptance.user_agent", "");
      },
    },
  ];

  return (
    <MultiStepForm
      form={form}
      steps={steps}
      handleSubmit={handleSubmit}
      successAction={() => "/"}
      successPageText="Your investment has been submitted!"
      className="gap-6"
    />
  );
}
