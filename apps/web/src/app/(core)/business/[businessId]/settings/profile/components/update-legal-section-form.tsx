"use client";

import { cn } from "@repo/ui/lib/utils";
import { ComponentPropsWithoutRef, useEffect } from "react"
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
import { useAction } from "next-safe-action/hooks";
import { getBusinessByIdAction, upsertBusinessLegalSection } from "@/actions/busineses";
import { useBusiness } from "@/components/providers/business-provider";
import { zodResolver } from "@hookform/resolvers/zod";
import { useHookFormAction } from "@next-safe-action/adapter-react-hook-form/hooks";
import { zUpsertBusinessLegalSectionParams } from "@repo/sdk/zod";
import { pathIdSchema } from "@/actions/validations";

export function UpdateLegalSectionForm({ className, ...props }: ComponentPropsWithoutRef<"form">) {
  const { selectedBusiness } = useBusiness()

  const { executeAsync: getBusinessByIdAsync, isExecuting: getBusinessByIdIsExecuting } = useAction(getBusinessByIdAction, {
    onSuccess: ({ data }) => {
      if (data?.business) {
        form.setValue("business_number", data?.business?.business_legal_section?.business_number || "")
      } else {
        toast.error("Something went wrong", {
          description: "An unknown error occurred",
        })
      }
    },
    onError: ({ error }) => {
      toast.error("Something went wrong", {
        description: error.serverError?.message || "An unknown error occurred",
      })
    }
  })

  const { form, action: { isExecuting }, handleSubmitWithAction } =
    useHookFormAction(upsertBusinessLegalSection, zodResolver(zUpsertBusinessLegalSectionParams.extend({
      id: pathIdSchema,
    })), {
      actionProps: {
        onSuccess: () => {
          toast.success("Done!", {
            description: "Your business has been updated.",
          })
        },
        onError: ({ error }) => {
          toast.error("Something went wrong", {
            description: error.serverError?.message || "An unknown error occurred",
          })
        }
      },
      formProps: {
        defaultValues: {
          business_number: "",
          id: selectedBusiness.id,
        }
      },
    });

  useEffect(() => {
    getBusinessByIdAsync(selectedBusiness.id)
  }, [selectedBusiness.id, getBusinessByIdAsync])

  return (
    <Form {...form}>
      {getBusinessByIdIsExecuting ?
        <div>Loading...</div>
        :
        (
          <form onSubmit={handleSubmitWithAction} className={cn("space-y-8 w-full max-w-md", className)} {...props}>
            <FormField
              control={form.control}
              name="business_number"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Business Number</FormLabel>
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
            <Button type="submit" disabled={isExecuting}>
              {isExecuting && <Icons.spinner className="w-4 h-4 animate-spin" />}
              Update Business
            </Button>
          </form>
        )
      }
    </Form>
  )
}
