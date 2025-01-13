"use client";

import { cn } from "@repo/ui/lib/utils";
import { ComponentPropsWithoutRef } from "react"
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
import { Loader2 } from "lucide-react";
import { z } from "zod";

export function CreateRoundForm({ className, ...props }: ComponentPropsWithoutRef<"form">) {
  const router = useRouter()
  const { selectedBusiness } = useBusiness()

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
          price_per_share_usd_cents: 100,
          total_business_shares: 1000,
          total_shares_for_sale: 100,
        }
      },
    });

  const handleSubmit = async (values: z.infer<typeof zCreateRoundParams>) => {
    await executeAsync({
      ...values,
      price_per_share_usd_cents: values.price_per_share_usd_cents * 100,
    })
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className={cn("space-y-8 w-full max-w-md", className)} {...props}>
        <FormField
          control={form.control}
          name="price_per_share_usd_cents"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Price per Share (USD)</FormLabel>
              <FormControl>
                <Input type="number" min={0} step="0.01" {...field} onChange={e => field.onChange(e.target.valueAsNumber)} />
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
                <Input type="number" min={0} step="1" {...field} onChange={e => field.onChange(e.target.valueAsNumber)} />
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
                <Input type="number" min={1} step="1" {...field} onChange={e => field.onChange(e.target.valueAsNumber)} />
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
        <Button type="submit" disabled={isExecuting} className="w-full">
          {isExecuting && <Loader2 className="w-4 h-4 animate-spin" />}
          Create Funding Round
        </Button>
      </form>
    </Form>
  )
}
