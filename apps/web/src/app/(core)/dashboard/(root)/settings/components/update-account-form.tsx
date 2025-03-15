"use client";

import { Button } from "@fundlevel/ui/components/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@fundlevel/ui/components/form";
import { Input } from "@fundlevel/ui/components/input";
import { useToast } from "@fundlevel/ui/hooks/use-toast";
import { updateAccountAction } from "@/actions/auth";
import { ComponentPropsWithoutRef, FC } from "react";
import { Icons } from "@/components/icons";
import { cn } from "@fundlevel/ui/lib/utils";
import { useAuth } from "@/components/providers/auth-provider";
import { useHookFormAction } from "@next-safe-action/adapter-react-hook-form/hooks";
import { zodResolver } from "@hookform/resolvers/zod";
import { zUpdateAccountParams } from "@fundlevel/sdk/zod";

export interface UpdateAccountFormProps
  extends ComponentPropsWithoutRef<"form"> {
  onSuccess?: () => void;
}

export function UpdateAccountForm({
  className,
  onSuccess,
  ...props
}: UpdateAccountFormProps) {
  const { account } = useAuth();
  const { toast } = useToast();
  const {
    form,
    action: { isExecuting },
    handleSubmitWithAction,
  } = useHookFormAction(
    updateAccountAction,
    zodResolver(zUpdateAccountParams),
    {
      actionProps: {
        onSuccess: () => {
          toast({
            title: "Account updated successfully!",
          });
          onSuccess?.();
        },
        onError: ({ error }) => {
          console.log(error);
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
          first_name: account?.first_name || "",
          last_name: account?.last_name || "",
        },
      },
    },
  );

  return (
    <Form {...form}>
      <form
        onSubmit={handleSubmitWithAction}
        className={cn("space-y-4", className)}
        {...props}
      >
        <FormField
          control={form.control}
          name="first_name"
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
          name="last_name"
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
        <Button
          type="submit"
          className="w-full flex justify-center items-center"
        >
          {isExecuting && (
            <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
          )}
          Update
        </Button>
      </form>
    </Form>
  );
}
