"use client";

import { cn } from "@repo/ui/lib/utils";
import { ComponentPropsWithoutRef, useEffect } from "react"
import { useForm } from "react-hook-form"
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
import { getBusinessById, upsertBusinessLegalSection } from "@/actions/busineses";
import { yupResolver } from "@hookform/resolvers/yup";
import { InferType } from "yup";
import { upsertBusinessLegalSectionSchema } from "@/actions/validations/business";
import { useBusinessContext } from "../../../components/business-context";

export interface UpdateLegalSectionFormProps extends ComponentPropsWithoutRef<"form"> { }

export const UpdateLegalSectionForm = ({ className, ...props }: UpdateLegalSectionFormProps) => {
  const { currentBusiness } = useBusinessContext()

  const form = useForm<InferType<typeof upsertBusinessLegalSectionSchema>>({
    resolver: yupResolver(upsertBusinessLegalSectionSchema),
    defaultValues: {
      businessNumber: ""
    }
  })

  const { executeAsync, isExecuting } = useAction(upsertBusinessLegalSection, {
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
  })

  const { executeAsync: getBusinessByIdAsync, isExecuting: getBusinessByIdIsExecuting } = useAction(getBusinessById, {
    onSuccess: ({ data }) => {
      if (data?.business) {
        form.setValue("businessNumber", data?.business?.businessLegalSection?.businessNumber || "")
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


  useEffect(() => {
    if (currentBusiness?.id) {
      getBusinessByIdAsync(currentBusiness?.id)
    }
  }, [currentBusiness?.id])

  const onSubmit = async (values: InferType<typeof upsertBusinessLegalSectionSchema>) => {
    if (isExecuting) return
    const res = await executeAsync({
      id: currentBusiness?.id,
      upsertBusinessLegalSectionSchema: values
    })
    if (res?.serverError || res?.validationErrors) {
      return new Error("Something went wrong")
    }
  }

  console.log(form.getValues())
  return (
    <Form {...form}>
      {getBusinessByIdIsExecuting ?
        <div>Loading...</div>
        :
        (
          <form onSubmit={form.handleSubmit(onSubmit)} className={cn("space-y-8 w-full max-w-md", className)} {...props}>
            <FormField
              control={form.control}
              name="businessNumber"
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
