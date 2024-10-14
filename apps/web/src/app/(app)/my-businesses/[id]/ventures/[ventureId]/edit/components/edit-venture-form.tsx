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
import { updateVenture } from "@/actions/ventures";
import { yupResolver } from "@hookform/resolvers/yup";
import { updateVentureSchema } from "@/lib/validations/ventures";
import { Textarea } from "@/components/ui/textarea";
import { InferType } from "yup";

export interface EditVentureFormProps extends ComponentPropsWithoutRef<'form'> {
  onSuccess?: () => void
  ventureId: number
}

export const EditVentureForm: FC<EditVentureFormProps> = ({ className, onSuccess, ventureId, ...props }) => {
  const router = useRouter()

  const form = useForm<InferType<typeof updateVentureSchema>>({
    resolver: yupResolver(updateVentureSchema),
    defaultValues: {
      id: ventureId,
    }
  })

  const { executeAsync, isExecuting } = useAction(updateVenture, {
    onSuccess: () => {
      form.reset()
      toast.success("Done!", {
        description: "Your venture has been updated.",
      })
      router.refresh()
      onSuccess?.()
    },
    onError: ({ error }) => {
      toast.error("Something went wrong", {
        description: error.serverError?.message || "An unknown error occurred",
      })
    }
  })

  const onSubmit = async (values: InferType<typeof updateVentureSchema>) => {
    await executeAsync({ ...values, id: ventureId })
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className={cn("space-y-8", className)} {...props}>
        <FormField
          control={form.control}
          name="name"
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
          name="description"
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
        <Button type="submit" disabled={isExecuting} className="w-full">
          {isExecuting && (<Icons.spinner className="mr-2 h-4 w-4 animate-spin" />)}
          Update
        </Button>
      </form>
    </Form>
  )
}