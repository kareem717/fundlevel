"use client";

import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { toast } from "sonner"
import { updateAccount } from "@/actions/auth";
import { ComponentPropsWithoutRef, FC } from "react";
import { Icons } from "@/components/icons";
import { useRouter } from "next/navigation";
import { useAction } from "next-safe-action/hooks";
import { Account } from "@/lib/api";
import { cn } from "@/lib/utils";
import { InferType } from "yup";
import { updateAccountSchema } from "@/lib/validations/account";
import { yupResolver } from "@hookform/resolvers/yup";

export interface UpdateAccountFormProps extends ComponentPropsWithoutRef<"form"> {
  account: Account
}

export const UpdateAccountForm: FC<UpdateAccountFormProps> = ({ account, className, ...props }) => {
  const router = useRouter();

  const form = useForm<InferType<typeof updateAccountSchema>>({
    resolver: yupResolver(updateAccountSchema),
    defaultValues: {
      name: account?.name || "",
    },
  });

  const { executeAsync, isExecuting } = useAction(updateAccount, {
    onSuccess: () => {
      toast.success("Account updated successfully!");
      router.refresh();
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
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Name</FormLabel>
              <FormControl>
                <Input placeholder="Jimmy" {...field} />
              </FormControl>
              <FormDescription>
                This is your public display name.
              </FormDescription>
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
