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

export function CreateRoundForm({ className, ...props }: ComponentPropsWithoutRef<"form">) {
  const router = useRouter()
  const { selectedBusiness } = useBusiness()

  const { form, action: { isExecuting }, handleSubmitWithAction } =
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
          price_per_share_usd_cents: undefined,
          total_business_shares: undefined,
          total_shares_for_sale: undefined,
        }
      },
    });

  return (
    <Form {...form}>
      <form onSubmit={handleSubmitWithAction} className={cn("space-y-8 w-full max-w-md", className)} {...props}>
        <FormField
          control={form.control}
          name="price_per_share_usd_cents"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Price per Share (USD)</FormLabel>
              <FormControl>
                <Input type="number" min={0} step="0.01" {...field} onChange={(e) => {
                  const value = Number(parseFloat(e.target.value).toFixed(2));
                  field.onChange(value * 100);
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
                <Input type="number" min={0} step="1" {...field} />
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
                <Input type="number" min={1} step="1" {...field} />
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
        <Button>Create Funding Round</Button>
      </form>
    </Form>
  )
}
