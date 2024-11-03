"use client";

import { MultiStepForm, Step } from "@/components/ui/multistep-form";
import { cn } from "@/lib/utils";
import { ComponentPropsWithoutRef } from "react"
import { useForm } from "react-hook-form"
import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Icons } from "@/components/ui/icons";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { useAction } from "next-safe-action/hooks";
import { useRouter } from "next/navigation";
import { createBusiness } from "@/actions/busineses";
import { yupResolver } from "@hookform/resolvers/yup";
import { InferType } from "yup";
import { createBusinessSchema } from "@/actions/validations/business";
import { AddressInput } from "@/components/ui/address-input";
import { Popover, PopoverTrigger, PopoverContent } from "@/components/ui/popover";
import { format } from "date-fns";
import { Calendar } from "@/components/ui/calendar";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select";
import { IndustrySelect } from "@/components/ui/industry-select";
import redirects from "@/lib/config/redirects";

export interface CreateBusinessFormProps extends ComponentPropsWithoutRef<"form"> { }

export const CreateBusinessForm = ({ className, ...props }: CreateBusinessFormProps) => {
  const router = useRouter()

  const form = useForm<InferType<typeof createBusinessSchema>>({
    resolver: yupResolver(createBusinessSchema),
    defaultValues: {
      business: {
        businessNumber: "",
        name: ""
      }
    }
  })

  const { executeAsync } = useAction(createBusiness, {
    onSuccess: () => {
      form.reset()
      toast.success("Done!", {
        description: "Your business has been created.",
      })
      router.refresh()
    },
    onError: ({ error }) => {
      toast.error("Something went wrong", {
        description: error.serverError?.message || "An unknown error occurred",
      })
    }
  })

  const onSubmit = async (values: InferType<typeof createBusinessSchema>) => {
    const res = await executeAsync(values)
    if (res?.serverError || res?.validationErrors) {
      return new Error("Something went wrong")
    }
  }


  const steps: Step<InferType<typeof createBusinessSchema>>[] = [
    {
      content: (
        <div className="space-y-8 w-full max-w-md">
          <FormField
            control={form.control}
            name="business.businessNumber"
            render={({ field }) => (
              <FormItem >
                <FormLabel>Business Number</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
                <FormDescription>
                  This is the unique business number.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="business.teamSize"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Team Size</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select a team size" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {["1", "2-10", "11-50", "51-200", "201-500", "501-1000", "1000+"].map((value) => (
                      <SelectItem key={value} value={value}>{value}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormDescription>
                  This is the number of people on the team for this venture.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="business.industryId"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Industry</FormLabel>
                <IndustrySelect onValueChange={field.onChange} />
                <FormDescription>
                  This is the industry of the business.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="business.isRemote"
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
                    Is Remote
                  </FormLabel>
                  <FormDescription>
                    Select this if this venture&#39;s main point of business is remote/online.
                  </FormDescription>
                </div>
              </FormItem>
            )}
          />
        </div>
      ), fields: [
        "business.businessNumber",
        "business.teamSize",
        "business.industryId",
        "business.isRemote"
      ]
    },
    {
      content: (
        <div className="space-y-8">
          <FormField
            control={form.control}
            name="business.foundingDate"
            render={({ field }) => (
              <FormItem className="flex flex-col">
                <FormLabel>Founding Date</FormLabel>
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
                      disabled={(date) =>
                        date > new Date() || date < new Date("1800-01-01")
                      }
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
                <FormDescription>
                  Your date of birth is used to calculate your age.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="business.name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Business Name</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
                <FormDescription>
                  This is the public display name of the business.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="address"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Address</FormLabel>
                <FormControl>
                  <AddressInput
                    onRetrieve={(val) => field.onChange(val)}
                  />
                </FormControl>
                <FormDescription>
                  The city where the business is located.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
      ), fields: [
        "business.name",
        "business.foundingDate"
      ]
    },
  ];

  return (
    <MultiStepForm
      className={cn(className)}
      {...props}
      form={form}
      steps={steps}
      handleSubmit={onSubmit}
      successAction={() => router.push(redirects.app.businessDashboard.root)}
      successButtonText="Go to dashboard"
    />
  )
}
