"use client";

import { cn } from "@repo/ui/lib/utils";
import { ComponentPropsWithoutRef, useEffect, useState } from "react"
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@repo/ui/components/form"
import { Input } from "@repo/ui/components/input"
import { Button } from "@repo/ui/components/button";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { createRound } from "@/actions/rounds";
import { Textarea } from "@repo/ui/components/textarea";
import { redirects } from "@/lib/config/redirects";
import { useBusiness } from "@/components/providers/business-provider";
import { zCreateRoundParams } from "@repo/sdk/zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useHookFormAction } from "@next-safe-action/adapter-react-hook-form/hooks";
import { Loader2 } from 'lucide-react';
import { z } from "zod";
import { Label } from "@repo/ui/components/label";
import { formatCurrency } from "@/lib/utils";
import { Separator } from "@repo/ui/components/separator";

export function CreateRoundForm({ className, ...props }: ComponentPropsWithoutRef<"form">) {
  const router = useRouter()
  const { selectedBusiness } = useBusiness()
  const [valuation, setValuation] = useState<number>(0)

  const { form, action: { isExecuting, executeAsync } } =
    useHookFormAction(createRound, zodResolver(zCreateRoundParams), {
      actionProps: {
        onSuccess: () => {
          form.reset()
          toast.success("Done!", {
            description: "Your business has been created.",
          })
          router.push(redirects.app.root)
        },
        onError: ({ error }) => {
          toast.error("Something went wrong", {
            description: error.serverError?.message || "An unknown error occurred",
          })
        }
      },
      formProps: {
        defaultValues: {
          business_id: selectedBusiness.id,
          description: "",
          price_per_share_usd_cents: 0,
          total_business_shares: 2,
          total_shares_for_sale: 1,
        }
      },
    });

  const handleSubmit = async (values: z.infer<typeof zCreateRoundParams>) => {
    await executeAsync({
      ...values,
      price_per_share_usd_cents: values.price_per_share_usd_cents * 100,
    })
  }

  const pricePerShare = form.watch('price_per_share_usd_cents')
  const totalShares = form.watch('total_business_shares')

  useEffect(() => {
    if (isNaN(pricePerShare) || isNaN(totalShares)) {
      setValuation(0)
    } else {
      setValuation(pricePerShare * totalShares)
    }
  }, [pricePerShare, totalShares])

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className={cn("space-y-8 w-full", className)} {...props}>
        <FormField
          control={form.control}
          name="price_per_share_usd_cents"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Price per Share (USD)</FormLabel>
              <FormControl>
                <Input type="number" min={0} step="0.01" {...field} onChange={e => {
                  field.onChange(e.target.valueAsNumber)
                }} />
              </FormControl>
              <FormDescription>
                What is the price per share in USD?
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="total_business_shares"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Total Business Shares</FormLabel>
              <FormControl>
                <Input type="number" min={0} step="1" {...field} onChange={e => {
                  field.onChange(e.target.valueAsNumber)
                }} />
              </FormControl>
              <FormDescription>
                How many shares does the entire company have?
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="total_shares_for_sale"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Total Shares for Sale</FormLabel>
              <FormControl>
                <Input type="number" min={1} step="1" {...field} onChange={e => {
                  field.onChange(e.target.valueAsNumber)
                }} />
              </FormControl>
              <FormDescription>
                How many shares are you selling?
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Description</FormLabel>
              <FormControl>
                <Textarea {...field} />
              </FormControl>
              <FormDescription>
                Describe this funding round
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <Separator />
        <div className="flex flex-col gap-2">
          <Label>Valuation</Label>
          <p className="mt-2 text-2xl font-bold">
            {formatCurrency(valuation, "USD", "en-US")}
          </p>
          <p className="mt-2 text-sm text-muted-foreground">
            The valuation of your business is the total value of your business. This is calculated by multiplying the price per share by the total number of shares.
          </p>
        </div>
        <Button type="submit" disabled={isExecuting} className="w-full">
          {isExecuting && <Loader2 className="w-4 h-4 animate-spin" />}
          Create Funding Round
        </Button>
      </form>
    </Form>
  )
}

