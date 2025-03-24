"use client";

import { zodResolver, useForm } from "@fundlevel/ui/components/form";
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
import type { ComponentPropsWithoutRef } from "react";
import { cn } from "@fundlevel/ui/lib/utils";
import { Loader2 } from "lucide-react";
import { CreateAccountParamsSchema } from "@fundlevel/db/validators";
import { redirect, useRouter } from "next/navigation";
import { redirects } from "@fundlevel/web/lib/config/redirects";
import { z } from "zod";
import { useMutation } from "@tanstack/react-query";
import { client } from "@fundlevel/sdk";
import { toast } from "@fundlevel/ui/components/sonner";
import { getTokenCached } from "@fundlevel/web/actions/auth";
import { env } from "@fundlevel/web/env";

interface CreateAccountFormProps
  extends Omit<ComponentPropsWithoutRef<"form">, "onSubmit"> {
  triggerProps?: ComponentPropsWithoutRef<typeof Button>;
  email: string | null;
  firstName: string | null;
  lastName: string | null;
}

type CreateAccountFormValues = z.infer<typeof CreateAccountParamsSchema>;

export function CreateAccountForm({
  className,
  triggerProps,
  email,
  firstName,
  lastName,
  ...props
}: CreateAccountFormProps) {
  const router = useRouter();

  const { mutate, isPending } = useMutation({
    mutationFn: async (values: CreateAccountFormValues) => {
      const token = await getTokenCached();
      console.log(token)
      if (!token) {
        redirect(redirects.auth.login);
      }

      const result = await client(env.NEXT_PUBLIC_BACKEND_URL, token).auth.$post({ json: values });

      if (!result.ok) {
        throw new Error("Failed to create account");
      }

      return await result.json();
    },
    onSuccess: (result) => {
      form.reset();

      toast.success(
        "Success!",
        {
          description:
            "Account created successfully. We're redirecting you to the dashboard.",
        });

      router.push(redirects.app.root);
    },
    onError: (error) => {
      toast.error("Uh oh! An error occurred.", {
        description: error.message,
      });
    },
  })

  const form = useForm<CreateAccountFormValues>({
    resolver: zodResolver(CreateAccountParamsSchema),
    defaultValues: {
      email: email || "",
      firstName: firstName || "",
      lastName: lastName || "",
    },
  })

  function onSubmit(values: CreateAccountFormValues) {
    mutate(values);
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className={cn("space-y-4", className)}
        {...props}
      >
        <div className="flex flex-col gap-4 md:flex-row">
          <FormField
            control={form.control}
            name="firstName"
            render={({ field }) => (
              <FormItem>
                <FormLabel>First Name</FormLabel>
                <FormControl>
                  <Input
                    placeholder="Enter your first name"
                    {...field}
                  />
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
                  <Input
                    placeholder="Enter your email"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input
                  placeholder="Enter your email"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" disabled={isPending} className="w-full">
          {isPending && <Loader2 className="mr-2 animate-spin" />}
          Create Account
        </Button>
      </form>
    </Form>

  );
}
