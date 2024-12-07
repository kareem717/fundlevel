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
import { Icons } from "@/components/ui/icons";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { useAction } from "next-safe-action/hooks";
import { useRouter } from "next/navigation";
import { createBusiness } from "@/actions/busineses";
import { yupResolver } from "@hookform/resolvers/yup";
import { InferType } from "yup";
import { createBusinessSchema } from "@/actions/validations/business";
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
import { IndustrySelect } from "@/components/industry-select";
import redirects from "@/lib/config/redirects";

export interface CreateBusinessFormProps extends ComponentPropsWithoutRef<"form"> { }

export const CreateBusinessForm = ({ className, ...props }: CreateBusinessFormProps) => {
  const router = useRouter()

  const form = useForm<InferType<typeof createBusinessSchema>>({
    resolver: yupResolver(createBusinessSchema),
    defaultValues: {
      business: {
        displayName: "",
        foundingDate: new Date(),
        employeeCount: "1",
      },
      industryIds: [],
    }
  })

  const { executeAsync } = useAction(createBusiness, {
    onSuccess: () => {
      form.reset()
      toast.success("Done!", {
        description: "Your business has been created.",
      })
      router.push(redirects.app.dashboard.index)
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

  console.log(form.getValues())
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className={cn("space-y-8 w-full max-w-md", className)} {...props}>
        <FormField
          control={form.control}
          name="business.displayName"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Display Name</FormLabel>
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
          name="business.employeeCount"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Employee Count</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select an employee count" />
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
          name="industryIds"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Industries</FormLabel>
              <FormControl>
                <IndustrySelect onValueChange={field.onChange} />
              </FormControl>
              <FormDescription>
                This is the industry of the business.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

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
                When was this business founded?
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button type="submit">Create Business</Button>
      </form>
    </Form>
  )
}
