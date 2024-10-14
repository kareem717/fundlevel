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
import { AddressInput } from "@/components/app/address-input";
import { BusinessSelect } from "@/components/app/input/business-select";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

export interface CreateVentureFormProps extends ComponentPropsWithoutRef<'form'> {
  onSuccess?: () => void
  businessId?: number
}

export const CreateVentureForm: FC<CreateVentureFormProps> = ({ className, onSuccess, businessId, ...props }) => {
  const router = useRouter()

  const form = useForm<InferType<typeof createVentureSchema>>({
    resolver: yupResolver(createVentureSchema),
    defaultValues: {
      venture: {
        businessId,
        isRemote: false,
        teamSize: "0-1",
      }
    }
  })

  const { executeAsync, isExecuting } = useAction(createVenture, {
    onSuccess: () => {
      form.reset()
      toast.success("Done!", {
        description: "Your venture has been created.",
      })
      router.push(`/my-businesses/${businessId}/ventures`)
      onSuccess?.()
    },
    onError: ({ error }) => {
      toast.error("Something went wrong", {
        description: error.serverError?.message || "An unknown error occurred",
      })
    }
  })

  const onSubmit = async (values: InferType<typeof createVentureSchema>) => {
    await executeAsync(values)
  }

  console.log(form.formState.errors)
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className={cn("space-y-8", className)} {...props}>
        {businessId == undefined && (
          <FormField
            control={form.control}
            name="venture.businessId"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Business</FormLabel>
                <FormControl>
                  <BusinessSelect onValueChange={(value) => field.onChange(parseInt(value))} />
                </FormControl>
                <FormDescription>
                  This is the business you want to create a venture for.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
        )}
        <FormField
          control={form.control}
          name="venture.name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Name</FormLabel>
              <FormControl>
                <Input  {...field} />
              </FormControl>
              <FormDescription>
                This is the public display name of the venture.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="venture.teamSize"
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
                  {["0-1", "2-10", "11-50", "51-200", "201-500", "501-1000", "1000+"].map((value) => (
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
          name="venture.isRemote"
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
                  Select this if this venture's main point of business is remote/online.
                </FormDescription>
              </div>
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="venture.description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>
                Decription
              </FormLabel>
              <FormControl>
                <Textarea  {...field} />
              </FormControl>
              <FormDescription>
                Describe your venture to potential investors.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="address"
          render={({ field: { onChange, value, ...fieldRest } }) => (
            <FormItem>
              <FormLabel>Address</FormLabel>
              <FormControl>
                <AddressInput
                  onRetrieve={(val) => onChange(val)}
                  {...fieldRest}
                />
              </FormControl>
              <FormDescription>
                The city where the business is located.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" disabled={isExecuting} className="w-full">
          {isExecuting && (<Icons.spinner className="mr-2 h-4 w-4 animate-spin" />)}
          Create
        </Button>
      </form>
    </Form>
  )
}