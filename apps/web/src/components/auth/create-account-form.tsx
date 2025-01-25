"use client";

import { Button } from "@repo/ui/components/button";
import { ComponentPropsWithoutRef, useState } from "react";
import { createAccountAction } from "@/actions/auth";
import { useRouter } from "next/navigation";
import { redirects } from "@/lib/config/redirects";
import { Loader2 } from "lucide-react";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@repo/ui/components/form";
import { Input } from "@repo/ui/components/input";
import { useHookFormAction } from "@next-safe-action/adapter-react-hook-form/hooks";
import { zodResolver } from "@hookform/resolvers/zod";
import { zCreateAccountParams } from "@repo/sdk/zod";
import { useToast } from "@repo/ui/hooks/use-toast";
import { cn } from "@repo/ui/lib/utils";

export interface CreateAccountFormProps extends ComponentPropsWithoutRef<"form"> {
  defaultFirstName?: string
  defaultLastName?: string
  redirect?: string
  onSuccess?: () => void
}

export function CreateAccountForm({
  defaultFirstName = "",
  defaultLastName = "",
  redirect = redirects.app.root,
  onSuccess,
  className,
  ...props
}: CreateAccountFormProps) {
  const router = useRouter()
  const { toast } = useToast();

  // We want to keep the loading state through redirect on success
  // thus we can't use the isExecuting state from the action
  const [isExecuting, setIsExecuting] = useState(false)

  const { form, handleSubmitWithAction } =
    useHookFormAction(createAccountAction, zodResolver(zCreateAccountParams), {
      actionProps: {
        onExecute: () => setIsExecuting(true),
        onSuccess: () => {
          toast({
            title: "Done!",
            description: `Your account has been created successfully.${redirect ? ` We are redirecting you now.` : ""}`,
          })

          form.reset()

          onSuccess?.()

          if (redirect) {
            router.push(redirect)
          }

        },
        onError: ({ error }) => {
          toast({
            title: "Error",
            description: error.serverError?.message ?? "An error occurred",
            variant: "destructive",
          })
          setIsExecuting(false)
        }
      },
      formProps: {
        defaultValues: {
          first_name: defaultFirstName,
          last_name: defaultLastName,
        },
      },
    });

  return (
    <Form {...form}>
      <form onSubmit={handleSubmitWithAction} className={cn("grid gap-6", className)} {...props} >
        <div className="grid md:grid-cols-2 gap-6">
          <FormField
            control={form.control}
            name="first_name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>First Name</FormLabel>
                <FormControl>
                  <Input
                    type="text"
                    placeholder="Foo"
                    {...field}
                  />
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
                  <Input
                    type="text"
                    placeholder="Bar"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <Button type="submit" disabled={isExecuting}>
          {isExecuting && <Loader2 className="w-4 h-4 animate-spin" />}
          Create Account
        </Button>
      </form>
    </Form>
  );
};
