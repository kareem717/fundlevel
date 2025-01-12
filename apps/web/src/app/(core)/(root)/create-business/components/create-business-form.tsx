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
import { createBusiness } from "@/actions/busineses";
import { Popover, PopoverTrigger, PopoverContent } from "@repo/ui/components/popover";
import { format } from "date-fns";
import { Calendar } from "@repo/ui/components/calendar";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@repo/ui/components/select";
import { IndustrySelect } from "@/components/industry-select";
import { redirects } from "@/lib/config/redirects";
import { zCreateBusinessParams } from "@repo/sdk/zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useHookFormAction } from "@next-safe-action/adapter-react-hook-form/hooks";

export interface CreateBusinessFormProps extends ComponentPropsWithoutRef<"form"> { }

export const CreateBusinessForm = ({ className, ...props }: CreateBusinessFormProps) => {
  const router = useRouter()

  const { form, action: { isExecuting }, handleSubmitWithAction } =
    useHookFormAction(createBusiness, zodResolver(zCreateBusinessParams), {
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
          business: {
            displayName: "",
            foundingDate: new Date().toISOString(),
            employeeCount: "1",
          },
          industryIds: [],
        }
      },
    });

  return (
    <Form {...form}>
      <form onSubmit={handleSubmitWithAction} className={cn("space-y-8 w-full max-w-md", className)} {...props}>
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
                    selected={field.value ? new Date(field.value) : undefined}
                    onSelect={(date) => {
                      field.onChange(date?.toISOString() || undefined)
                    }}
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

        <Button type="submit" disabled={isExecuting}>
          {isExecuting && <Icons.spinner className="w-4 h-4 animate-spin" />}
          Create Business
        </Button>
      </form>
    </Form>
  )
}
