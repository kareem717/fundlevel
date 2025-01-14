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
import { createInvestmentAction } from "@/actions/investment";

const investFormSchema = z.object({
  amount: z.string(),
});

type InvestFormValues = z.infer<typeof investFormSchema>;

export interface InvestFormProps extends ComponentPropsWithoutRef<typeof Card> {
  round: Round;
  business: Business;
}

export function InvestForm({ round, business, className, ...props }: InvestFormProps) {
  const form = useForm<InvestFormValues>({
    resolver: zodResolver(investFormSchema),
    defaultValues: {
      amount: "",
    },
  });

  const { executeAsync: createInvestment, isExecuting: createInvestmentIsExecuting } = useAction(createInvestmentAction);

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
      fields: ["amount"],
      content: (
        <Card {...cardProps}>
          <CardHeader>
            <CardTitle>Investment Details</CardTitle>
            <CardDescription>Enter your investment amount</CardDescription>
          </CardHeader>
          <CardContent>
            <FormField
              control={form.control}
              name="amount"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Amount</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      placeholder="Enter amount"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </CardContent>
        </Card>
      ),
    },
    {
      fields: ["amount"],
      content: (
        <Card {...cardProps}>
          <CardHeader>
            <CardTitle>Investment Details</CardTitle>
            <CardDescription>Enter your investment amount</CardDescription>
          </CardHeader>
          <CardContent>
            <FormField
              control={form.control}
              name="amount"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Amount</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      placeholder="Enter amount"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
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
      successAction={() => "/"}
      successPageText="Your investment has been submitted!"
      className="gap-6"
    />
  );
}
