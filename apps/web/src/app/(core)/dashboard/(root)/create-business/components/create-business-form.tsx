"use client";

import { cn } from "@fundlevel/ui/lib/utils";
import { ComponentPropsWithoutRef } from "react";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@fundlevel/ui/components/form";
import { Input } from "@fundlevel/ui/components/input";
import { Icons } from "@/components/icons";
import { Button } from "@fundlevel/ui/components/button";
import { useToast } from "@fundlevel/ui/hooks/use-toast";
import { useRouter } from "next/navigation";
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from "@fundlevel/ui/components/popover";
import { format } from "date-fns";
import { Calendar } from "@fundlevel/ui/components/calendar";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@fundlevel/ui/components/select";
import { IndustrySelect } from "@/components/industry-select";
import { redirects } from "@/lib/config/redirects";
import { zCreateBusinessParams } from "@fundlevel/sdk/zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useHookFormAction } from "@next-safe-action/adapter-react-hook-form/hooks";
import { createBusinessAction } from "@/actions/business";

export function CreateBusinessForm({
  className,
  ...props
}: ComponentPropsWithoutRef<"form">) {
  const router = useRouter();
  const { toast } = useToast();

  const {
    form,
    action: { isExecuting },
    handleSubmitWithAction,
  } = useHookFormAction(
    createBusinessAction,
    zodResolver(zCreateBusinessParams),
    {
      actionProps: {
        onSuccess: ({ data }) => {
          form.reset();
          toast({
            title: "Done!",
            description: "Your business has been created.",
          });

          if (data) {
            router.push(redirects.app.businessDashboard(data.id).root);
          } else {
            router.push(redirects.app.root);
          }
        },
        onError: ({ error }) => {
          toast({
            title: "Something went wrong",
            description:
              error.serverError?.message || "An unknown error occurred",
            variant: "destructive",
          });
        },
      },
      formProps: {
        defaultValues: {
          business: {
            display_name: "",
            founding_date: new Date().toISOString(),
            employee_count: "1",
          },
          industry_ids: [],
        },
      },
    },
  );

  return (
    <Form {...form}>
      <form
        onSubmit={handleSubmitWithAction}
        className={cn("space-y-8 w-full max-w-md", className)}
        {...props}
      >
        <FormField
          control={form.control}
          name="business.display_name"
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
          name="business.employee_count"
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
                  {[
                    "1",
                    "2-10",
                    "11-50",
                    "51-200",
                    "201-500",
                    "501-1000",
                    "1000+",
                  ].map((value) => (
                    <SelectItem key={value} value={value}>
                      {value}
                    </SelectItem>
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
          name="industry_ids"
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
          name="business.founding_date"
          render={({ field }) => (
            <FormItem className="flex flex-col">
              <FormLabel>Founding Date</FormLabel>
              <Popover>
                <PopoverTrigger asChild>
                  <FormControl>
                    <Button
                      variant={"outline"}
                      className={cn(
                        "pl-3 text-left font-normal",
                        !field.value && "text-muted-foreground",
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
                      field.onChange(date?.toISOString() || undefined);
                    }}
                    disabled={(date) =>
                      date > new Date() || date < new Date("1800-01-01")
                    }
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
              <FormDescription>When was this business founded?</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button type="submit" disabled={isExecuting} className="w-full">
          {isExecuting && <Icons.spinner className="w-4 h-4 animate-spin" />}
          Create Business
        </Button>
      </form>
    </Form>
  );
}
