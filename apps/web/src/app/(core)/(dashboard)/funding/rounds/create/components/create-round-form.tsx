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
import { Icons } from "@/components/icons";
import { Button } from "@repo/ui/components/button";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { createRound } from "@/actions/rounds";
import { Popover, PopoverTrigger, PopoverContent } from "@repo/ui/components/popover";
import { format } from "date-fns";
import { Calendar } from "@repo/ui/components/calendar";
import { redirects } from "@/lib/config/redirects";
import { useBusinessContext } from "../../../../components/business-context";
import { zCreateRoundParams } from "@repo/sdk/zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useHookFormAction } from "@next-safe-action/adapter-react-hook-form/hooks";

export interface CreateRoundFormProps extends ComponentPropsWithoutRef<"form"> { }

export const CreateRoundForm = ({ className, ...props }: CreateRoundFormProps) => {
  const router = useRouter()
  const { currentBusiness } = useBusinessContext()

  const { form, action: { isExecuting }, handleSubmitWithAction } =
    useHookFormAction(createRound, zodResolver(zCreateRoundParams), {
      actionProps: {
        onSuccess: () => {
          form.reset()
          toast.success("Done!", {
            description: "Your business has been created.",
          })
          router.push(redirects.app.index)
        },
        onError: ({ error }) => {
          toast.error("Something went wrong", {
            description: error.serverError?.message || "An unknown error occurred",
          })
        }
      },
      formProps: {
        defaultValues: {
          businessId: currentBusiness.id,
          beginsAt: format(new Date(Date.now() + 1000 * 60 * 60 * 24), "yyyy-MM-dd"),
          endsAt: format(new Date(Date.now() + 1000 * 60 * 60 * 24 * 30), "yyyy-MM-dd"),
          percentageSelling: 0,
          valuationAmountUSDCents: 0,
          // causes uncontrolled component warning
          description: undefined,
          investorCount: 1,
        }
      },
    });

  return (
    <Form {...form}>
      <form onSubmit={handleSubmitWithAction} className={cn("space-y-8 w-full max-w-md", className)} {...props}>
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
                    selected={new Date(field.value)}
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
                    selected={new Date(field.value)}
                    onSelect={field.onChange}
                    disabled={(date) => date < new Date(form.getValues().beginsAt)}
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
          name="percentageSelling"
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
          name="valuationAmountUSDCents"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Valuation (USD)</FormLabel>
              <FormControl>
                <Input type="number" min={0} {...field} onChange={(e) => field.onChange(Number(e.target.value) * 100)} />
              </FormControl>
              <FormDescription>
                What is the USD valuation of the company?
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
