"use client";

import { cn } from "@/lib/utils";
import { ComponentPropsWithoutRef } from "react"
import { useForm } from "react-hook-form"
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Icons } from "@/components/icons";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { useAction } from "next-safe-action/hooks";
import { useRouter } from "next/navigation";
import { createRound } from "@/actions/rounds";
import { yupResolver } from "@hookform/resolvers/yup";
import { InferType } from "yup";
import { Popover, PopoverTrigger, PopoverContent } from "@/components/ui/popover";
import { format } from "date-fns";
import { Calendar } from "@/components/ui/calendar";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select";
import redirects from "@/lib/config/redirects";
import { useBusinessContext } from "../../../../components/business-context";
import { zCreateRoundParams } from "@repo/sdk/zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

export interface CreateRoundFormProps extends ComponentPropsWithoutRef<"form"> { }

export const CreateRoundForm = ({ className, ...props }: CreateRoundFormProps) => {
  const router = useRouter()
  const { currentBusiness } = useBusinessContext()

  const form = useForm<z.infer<typeof zCreateRoundParams>>({
    resolver: zodResolver(zCreateRoundParams),
    defaultValues: {
      businessId: currentBusiness.id,
      beginsAt: format(new Date(Date.now() + 1000 * 60 * 60 * 24), "yyyy-MM-dd"),
      endsAt: format(new Date(Date.now() + 1000 * 60 * 60 * 24 * 30), "yyyy-MM-dd"),
      percentageSelling: 0,
      valuationAmountUSDCents: 0,
      valueCurrency: "usd",
      // causes uncontrolled component warning
      description: undefined,
      investorCount: 1,
    }
  })

  const { executeAsync } = useAction(createRound, {
    onSuccess: () => {
      form.reset()
      toast.success("Done!", {
        description: "Your funding round has been created.",
      })
      router.push(redirects.app.dashboard.index)
    },
    onError: ({ error }) => {
      toast.error("Something went wrong", {
        description: error.serverError?.message || "An unknown error occurred",
      })
    }
  })

  const onSubmit = async (values: InferType<typeof zCreateRoundParams>) => {
    const res = await executeAsync(values)
    if (res?.serverError || res?.validationErrors) {
      return new Error("Something went wrong")
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className={cn("space-y-8 w-full max-w-md", className)} {...props}>
        <FormField
          control={form.control}
          name="beginsAt"
          render={({ field }) => (
            <FormItem className="flex flex-col">
              <FormLabel>Start Date</FormLabel>
              <Popover>
                <PopoverTrigger asChild>
                  <FormControl>
                    <Button
                      variant={"outline"}
                      className={cn(
                        "w-[240px] pl-3 text-left font-normal",
                        !field.value && "text-muted-foreground"
                      )}
                    >
                      {field.value ? (
                        format(field.value, "PPP")
                      ) : (
                        <span>Pick a date</span>
                      )}
                      <Icons.calendar className="ml-auto h-4 w-4 opacity-50" />
                    </Button>
                  </FormControl>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={field.value}
                    onSelect={field.onChange}
                    disabled={(date) => date < new Date()}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
              <FormDescription>
                When should this funding round start?
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="endsAt"
          render={({ field }) => (
            <FormItem className="flex flex-col">
              <FormLabel>End Date</FormLabel>
              <Popover>
                <PopoverTrigger asChild>
                  <FormControl>
                    <Button
                      variant={"outline"}
                      className={cn(
                        "w-[240px] pl-3 text-left font-normal",
                        !field.value && "text-muted-foreground"
                      )}
                    >
                      {field.value ? (
                        format(field.value, "PPP")
                      ) : (
                        <span>Pick a date</span>
                      )}
                      <Icons.calendar className="ml-auto h-4 w-4 opacity-50" />
                    </Button>
                  </FormControl>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={field.value}
                    onSelect={field.onChange}
                    disabled={(date) => date < form.getValues().beginsAt}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
              <FormDescription>
                When should this funding round end?
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="percentageOffered"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Percentage Offered</FormLabel>
              <FormControl>
                <Input type="number" min={0} max={100} {...field} />
              </FormControl>
              <FormDescription>
                What percentage of equity are you offering?
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="percentageValue"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Value</FormLabel>
              <FormControl>
                <Input type="number" min={0} {...field} />
              </FormControl>
              <FormDescription>
                What is the value of the offered equity?
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="valueCurrency"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Currency</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a currency" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="usd">USD</SelectItem>
                  <SelectItem value="eur">EUR</SelectItem>
                  <SelectItem value="gbp">GBP</SelectItem>
                </SelectContent>
              </Select>
              <FormDescription>
                What currency is the value in?
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="investorCount"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Maximum Investors</FormLabel>
              <FormControl>
                <Input type="number" min={1} {...field} />
              </FormControl>
              <FormDescription>
                How many investors can participate?
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
                <Input {...field} />
              </FormControl>
              <FormDescription>
                Describe this funding round
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button type="submit">Create Funding Round</Button>
      </form>
    </Form>
  )
}
