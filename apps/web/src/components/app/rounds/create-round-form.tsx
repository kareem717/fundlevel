"use client";

import { ComponentPropsWithoutRef, FC, useState } from "react"
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
import { Input } from "@/components/ui/input"
import { Icons } from "@/components/icons";
import { Button, buttonVariants } from "@/components/ui/button";
import { toast } from "sonner";
import { useAction } from "next-safe-action/hooks";
import { useRouter } from "next/navigation";
import { createRound } from "@/actions/rounds";
import { yupResolver } from "@hookform/resolvers/yup";
import { createRoundSchema } from "@/lib/validations/rounds";
import { InferType } from "yup";
import { Checkbox } from "@/components/ui/checkbox";
import { Popover, PopoverTrigger, PopoverContent } from "@radix-ui/react-popover";
import { CalendarIcon } from "lucide-react";
import { format } from "date-fns"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { Calendar } from "@/components/ui/calendar";
import { UnitSelect } from "../input/unit-select";
import { type Unit } from "@/components/app/input/unit-select";

export interface CreateRoundFormProps extends ComponentPropsWithoutRef<'form'> {
  onSuccess?: () => void
  ventureId: number
}

const units: Unit[] = [
  { value: "USD", label: "USD", icon: <Icons.dollarSign className="h-4 w-4" /> },
  { value: "EUR", label: "EUR", icon: <span className="text-sm">€</span> },
  { value: "GBP", label: "GBP", icon: <span className="text-sm">£</span> },
  { value: "CAD", label: "CAD", icon: <span className="text-sm">CA$</span> },
  { value: "AUD", label: "AUD", icon: <span className="text-sm">AU$</span> },
  { value: "JPY", label: "JPY", icon: <span className="text-sm">¥</span> },
]

export const CreateRoundForm: FC<CreateRoundFormProps> = ({ className, onSuccess, ventureId, ...props }) => {
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const router = useRouter()

  const form = useForm<InferType<typeof createRoundSchema>>({
    resolver: yupResolver(createRoundSchema),
    defaultValues: {
      ventureId,
      startTime: new Date(new Date().setDate(new Date().getDate() + 1)),
      endTime: new Date(new Date().setDate(new Date().getDate() + 2)),
      percentageValueCurrency: "USD",
    }
  })

  const { executeAsync, isExecuting } = useAction(createRound, {
    onSuccess: () => {
      form.reset()
      toast.success("Done!", {
        description: "Your round has been created.",
      })
      router.refresh()
    },
    onError: ({ error }) => {
      toast.error("Something went wrong", {
        description: error.serverError?.message || "An unknown error occurred",
      })
    }
  })

  const handleDialogOpen = async () => {
    // console.log(calculateCompanyWorth(form.getValues("offeredPercentage"), form.getValues("usdPercentageValue")))
    await form.trigger()
    console.log(form.formState.errors)
    if (form.formState.isValid) {
      setIsDialogOpen(true)
    }
  }

  const onSubmit = async (values: InferType<typeof createRoundSchema>) => {
    await executeAsync({
      ...values,
      ventureId
    })
  }

  const calculateCompanyWorth = (percentage: number, usdValue: number) => {
    return Math.round(usdValue / (percentage / 100))
    // setCompanyWorth(worth)
  }

  console.log(form.getValues())

  return (
    <>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className={cn("space-y-8", className)} {...props}>
          <div className="grid grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="offeredPercentage"
              render={({ field }) => (
                <FormItem className="w-full">
                  <FormLabel>Offered Percentage</FormLabel>
                  <FormControl>
                    <div className="relative mt-1">
                      <Input
                        type="number"
                        min="0"
                        max="100"
                        step="0.1"
                        {...field}
                      />
                      <span className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                        %
                      </span>
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="flex flex-row gap-1.5 justify-center items-start w-full">
              <FormField
                control={form.control}
                name="percentageValue"
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
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="percentageValueCurrency"
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
          <div className="flex flex-row gap-4">
            <FormField
              control={form.control}
              name="minimumInvestmentPercentage"
              render={({ field }) => (
                <FormItem className="w-full">
                  <FormLabel>Minimum Investment Percentage</FormLabel>
                  <FormControl>
                    <div className="relative mt-1">
                      <Input
                        type="number"
                        min="0"
                        max="100"
                        step="0.1"
                        {...field}
                      />
                      <span className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                        %
                      </span>
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="maximumInvestmentPercentage"
              render={({ field }) => (
                <FormItem className="w-full">
                  <FormLabel>Maximum Investment Percentage</FormLabel>
                  <FormControl>
                    <div className="relative mt-1">
                      <Input
                        type="number"
                        min="0"
                        max="100"
                        step="0.1"
                        {...field}
                      />
                      <span className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                        %
                      </span>
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <div className="flex flex-row gap-4 w-full">
            <FormField
              control={form.control}
              name="startTime"
              render={({ field }) => (
                <FormItem className="flex flex-col w-full">
                  <FormLabel>Start Time</FormLabel>
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
                        disabled={(date: Date) =>
                          date <= new Date()
                        }
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                  <FormDescription>
                    The start time of the round.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="endTime"
              render={({ field }) => (
                <FormItem className="flex flex-col w-full">
                  <FormLabel>End Time</FormLabel>
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
                          date <= new Date()
                        }
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                  <FormDescription>
                    The end time of the round.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <FormField
            control={form.control}
            name="isAuctioned"
            render={({ field }) => (
              <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                <FormControl>
                  <Checkbox
                    checked={field.value}
                    onCheckedChange={field.onChange}
                  />
                </FormControl>
                <div className="space-y-1 leading-none">
                  <FormLabel>
                    Auction
                  </FormLabel>
                  <FormDescription>
                    You can manage your mobile notifications in the{" "}
                  </FormDescription>
                </div>
              </FormItem>
            )}
          />
          <Button
            className="w-full"
            disabled={isExecuting}
            onClick={handleDialogOpen}
            type="button"
          >
            Open
          </Button>
        </form>
        <AlertDialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Confirm</AlertDialogTitle>
              <AlertDialogDescription>
                Make sure the following details are a accurate summary of the round you are creating.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <div className="flex flex-col gap-4">
              ...display values here
            </div>
            <AlertDialogFooter>
              <AlertDialogCancel disabled={isExecuting}>Cancel</AlertDialogCancel>
              <AlertDialogAction disabled={isExecuting} className="flex flex-row gap-2" onClick={form.handleSubmit(onSubmit)}>
                {isExecuting && (<Icons.spinner className="mr-2 h-4 w-4 animate-spin" />)}
                Confirm
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </Form>
    </>
  )
}