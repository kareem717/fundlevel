"use client";

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
import { cn } from "@repo/ui/lib/utils";
import { useAuth } from "@/components/providers/auth-provider";
import { useHookFormAction } from "@next-safe-action/adapter-react-hook-form/hooks";
import { zodResolver } from "@hookform/resolvers/zod";
import { zUpdateAccountParams } from "@repo/sdk/zod";

export interface UpdateAccountFormProps extends ComponentPropsWithoutRef<"form"> {
  onSuccess?: () => void;
}

export const UpdateAccountForm: FC<UpdateAccountFormProps> = ({ className, onSuccess, ...props }) => {
  const { account } = useAuth()

  const { form, action: { isExecuting }, handleSubmitWithAction } =
    useHookFormAction(updateAccount, zodResolver(zUpdateAccountParams), {
      actionProps: {
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
      },
      formProps: {
        defaultValues: {
          firstName: account?.firstName || "",
          lastName: account?.lastName || "",
        },
      },
    });

  return (
    <Form {...form}>
      <form onSubmit={handleSubmitWithAction} className={cn("space-y-4", className)} {...props}>
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
