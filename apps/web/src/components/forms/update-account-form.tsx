"use client";

import { useForm } from "react-hook-form";
import { Button } from "@repo/ui/components/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@repo/ui/components/form";
import { Input } from "@repo/ui/components/input";
import { toast } from "sonner"
import { updateAccount } from "@/actions/auth";
import { ComponentPropsWithoutRef, FC } from "react";
import { Icons } from "@/components/icons";
import { useAction } from "next-safe-action/hooks";
import { cn } from "@repo/ui/lib/utils";
import { InferType } from "yup";
import { updateAccountSchema } from "@/actions/validations/account";
import { yupResolver } from "@hookform/resolvers/yup";
import { useAuth } from "@/components/providers/auth-provider";

export interface UpdateAccountFormProps extends ComponentPropsWithoutRef<"form"> {
  onSuccess?: () => void;
}

export const UpdateAccountForm: FC<UpdateAccountFormProps> = ({ className, onSuccess, ...props }) => {
  const { account } = useAuth()

  const form = useForm<InferType<typeof updateAccountSchema>>({
    resolver: yupResolver(updateAccountSchema),
    defaultValues: {
      firstName: account?.firstName || "",
      lastName: account?.lastName || "",
    },
  });

  const { executeAsync, isExecuting } = useAction(updateAccount, {
    onSuccess: () => {
      toast.success("Account updated successfully!");
      onSuccess?.()
    },
    onError: ({ error }) => {
      console.log(error);
      toast.error("Something went wrong", {
        description: error.serverError?.message || "An unknown error occurred",
      })
    },
  });

  async function onSubmit(values: InferType<typeof updateAccountSchema>) {
    await executeAsync({ ...values });
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className={cn("space-y-4", className)} {...props}>
        <FormField
          control={form.control}
          name="firstName"
          render={({ field }) => (
            <FormItem>
              <FormLabel>First Name</FormLabel>
              <FormControl>
                <Input placeholder="Jimmy" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="lastName"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Last Name</FormLabel>
              <FormControl>
                <Input placeholder="Smith" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" className="w-full flex justify-center items-center">
          {isExecuting && <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />}  Update account
        </Button>
      </form>
    </Form>
  );
};
