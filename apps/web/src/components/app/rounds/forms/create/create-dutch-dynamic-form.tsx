"use client";

import { ComponentPropsWithoutRef, FC } from "react"
import { cn } from "@/lib/utils"
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
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { Input } from "@/components/ui/input"
import { Icons } from "@/components/icons";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { useAction } from "next-safe-action/hooks";
import { useRouter } from "next/navigation";
import { createVenture } from "@/actions/ventures";
import { yupResolver } from "@hookform/resolvers/yup";
import { createVentureSchema } from "@/lib/validations/ventures";
import { Textarea } from "@/components/ui/textarea";
import { InferType } from "yup";
import { createDutchDynamicRoundSchema } from "@/lib/validations/rounds";
import { createDutchDynamicRound } from "@/actions/rounds";
import { Calendar } from "@/components/ui/calendar";
import { format } from "date-fns"
import { Unit, UnitSelect } from "../../../input/unit-select";
import { VentureSelect } from "../../../venture-select";

export interface CreateDutchDynamicRoundFormProps extends ComponentPropsWithoutRef<'form'> {
  onSuccess?: () => void
}

const units: Unit[] = [
  { value: "USD", label: "USD", icon: <Icons.dollarSign className="h-4 w-4" /> },
  { value: "EUR", label: "EUR", icon: <span className="text-sm">€</span> },
  { value: "GBP", label: "GBP", icon: <span className="text-sm">£</span> },
  { value: "CAD", label: "CAD", icon: <span className="text-sm">CA$</span> },
  { value: "AUD", label: "AUD", icon: <span className="text-sm">AU$</span> },
  { value: "JPY", label: "JPY", icon: <span className="text-sm">¥</span> },
]

export const CreateDutchDynamicRoundForm: FC<CreateDutchDynamicRoundFormProps> = ({ className, onSuccess, ...props }) => {
  const router = useRouter()

  const tomorrow = new Date()
  tomorrow.setDate(tomorrow.getDate() + 1)
  tomorrow.setHours(0, 0, 0, 0)

  const afterTomorrow = new Date(tomorrow)
  afterTomorrow.setDate(afterTomorrow.getDate() + 1)

  const form = useForm<InferType<typeof createDutchDynamicRoundSchema>>({
    resolver: yupResolver(createDutchDynamicRoundSchema),
    defaultValues: {
      round: {
        beginsAt: tomorrow,
        endsAt: afterTomorrow,
        percentageOffered: 1,
        percentageValue: 1000,
        valueCurrency: "USD",
        ventureId: 1,
        status: "active",
      },
    },
  })

  const { executeAsync, isExecuting } = useAction(createDutchDynamicRound, {
    onSuccess: () => {
      form.reset()
      toast.success("Done!", {
        description: "Your round has been created.",
      })
      onSuccess?.()
      router.refresh()
    },
    onError: ({ error }) => {
      toast.error("Something went wrong", {
        description: error.serverError?.message || "An unknown error occurred",
      })
    }
  })

  const onSubmit = async (values: InferType<typeof createDutchDynamicRoundSchema>) => {
    await executeAsync(values)
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className={cn("space-y-8", className)} {...props}>
        <FormField
          control={form.control}
          name="round.ventureId"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Venture</FormLabel>
              <FormControl>
                <VentureSelect onValueChange={(value) => field.onChange(parseInt(value))} />
              </FormControl>
              <FormDescription>
                This is the venture you want to create a round for.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="round.percentageOffered"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Percentage Offered</FormLabel>
                <FormControl>
                  <div className="relative mt-1">
                    <Input
                      type="number"
                      min="0"
                      max="100"
                      step="0.1"
                      placeholder="10"
                      {...field}
                    />
                    <span className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                      %
                    </span>
                  </div>
                </FormControl>
                <FormDescription>
                  This is the percentage of the venture that you are offering to sell.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <div className="flex flex-row gap-1.5 justify-center items-start w-full">
            <FormField
              control={form.control}
              name="round.percentageValue"
              render={({ field }) => (
                <FormItem className="w-full">
                  <FormLabel>Value</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      placeholder="25000"
                      {...field}
                    />
                  </FormControl>
                  <FormDescription>
                    This is the value of the percentage you are offering to sell.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="round.valueCurrency"
              render={({ field }) => (
                <FormItem className="w-min">
                  <FormLabel>Currency</FormLabel>
                  <FormControl>
                    <UnitSelect
                      availableUnits={units}
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                      triggerProps={{
                        className: "w-full"
                      }}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 w-full">
          <FormField
            control={form.control}
            name="round.beginsAt"
            render={({ field }) => (
              <FormItem className="flex flex-col w-full">
                <FormLabel>Starts At</FormLabel>
                <Popover>
                  <PopoverTrigger asChild>
                    <FormControl>
                      <Button
                        variant={"outline"}
                        className={cn(
                          "w-full pl-3 text-left font-normal",
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
                      disabled={(date) => {
                        const afterStart = new Date(form.getValues("round.beginsAt"))
                        afterStart.setDate(afterStart.getDate() + 1)
                        return date < afterStart
                      }}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
                <FormDescription>
                  This is the date the round will start.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="round.endsAt"
            render={({ field }) => (
              <FormItem className="flex flex-col w-full">
                <FormLabel>Ends At</FormLabel>
                <Popover>
                  <PopoverTrigger asChild>
                    <FormControl>
                      <Button
                        variant={"outline"}
                        className={cn(
                          "w-full pl-3 text-left font-normal",
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
                      disabled={(date) =>
                        // less than after tomorrow
                        date < form.getValues("round.beginsAt")
                      }
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
                <FormDescription>
                  This is the date the round will end.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <div className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4 w-full">
            <FormField
              control={form.control}
              name="dutchDynamicRound.valuationDollarDropRate"
              render={({ field }) => (
                <FormItem className="w-full">
                  <FormLabel>Dollar Drop Rate</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      placeholder="25000"
                      {...field}
                    />
                  </FormControl>
                  <FormDescription>
                    The venture valuation will drop by this every drop interval.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="dutchDynamicRound.valuationDropIntervalDays"
              render={({ field }) => (
                <FormItem className="w-full">
                  <FormLabel>Drop Interval (Days)</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      placeholder="25000"
                      {...field}
                    />
                  </FormControl>
                  <FormDescription>
                    Every this many days, the venture valuation will drop by the dollar drop rate.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="dutchDynamicRound.valuationStopLoss"
              render={({ field }) => (
                <FormItem className="w-full sm:col-span-2 xl:col-span-1">
                  <FormLabel>Stop Loss</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      placeholder="25000"
                      {...field}
                    />
                  </FormControl>
                  <FormDescription>
                    The buy-in price will continue to drop until the valuation is equal to or less than this value.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          {form.getValues("dutchDynamicRound.valuationStopLoss") && form.getValues("dutchDynamicRound.valuationDollarDropRate") && form.getValues("dutchDynamicRound.valuationDropIntervalDays") && (
            <p>
              The venture valuation will drop by <b>{form.getValues("dutchDynamicRound.valuationDollarDropRate")}</b> every <b>{form.getValues("dutchDynamicRound.valuationDropIntervalDays")}</b> days until it reaches <b>{form.getValues("dutchDynamicRound.valuationStopLoss")}</b>.
            </p>
          )}
        </div>
        <Button type="submit" disabled={isExecuting} className="w-full">
          {isExecuting && (<Icons.spinner className="mr-2 h-4 w-4 animate-spin" />)}
          Create
        </Button>
      </form>
    </Form>
  )
}