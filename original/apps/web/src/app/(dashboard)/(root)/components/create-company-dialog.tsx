"use client";

import { zodResolver, useForm } from "@fundlevel/ui/components/form";
import { Button, buttonVariants } from "@fundlevel/ui/components/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@fundlevel/ui/components/form";
import { Input } from "@fundlevel/ui/components/input";
import type { ComponentPropsWithoutRef } from "react";
import { cn } from "@fundlevel/ui/lib/utils";
import { Loader2 } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@fundlevel/ui/components/dialog";
import { CreateCompanyParamsSchema } from "@fundlevel/db/validators";
import { useRouter } from "next/navigation";
import { redirects } from "@fundlevel/web/lib/config/redirects";
import type { z } from "zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { client } from "@fundlevel/sdk";
import { useAuth } from "@fundlevel/web/components/providers/auth-provider";
import { toast } from "@fundlevel/ui/components/sonner";
import { env } from "@fundlevel/web/env";
import { parseAsBoolean, useQueryState } from "nuqs";
import { QUERY_KEYS } from "@fundlevel/web/lib/config/query-keys";

interface CreateCompanyDialogProps
  extends Omit<ComponentPropsWithoutRef<"form">, "onSubmit"> {
  triggerProps?: ComponentPropsWithoutRef<typeof Button>;
}

type CreateCompanyFormValues = z.infer<typeof CreateCompanyParamsSchema>;

export function CreateCompanyDialog({
  className,
  triggerProps,
  ...props
}: CreateCompanyDialogProps) {
  const router = useRouter();
  const queryClient = useQueryClient();
  const [dialogOpen, setDialogOpen] = useQueryState(
    "create",
    parseAsBoolean.withDefault(false).withOptions({
      history: "push",
    }),
  );

  const { authToken } = useAuth();
  if (!authToken) {
    throw new Error("CreateCompanyDialog: No bearer token found");
  }

  const { mutate, isPending } = useMutation({
    mutationFn: async (values: CreateCompanyFormValues) => {
      const payload = {
        name: values.name || "",
      };

      const result = await client(
        env.NEXT_PUBLIC_BACKEND_URL,
        authToken,
      ).company.$post({ json: payload });

      if (!result.ok) {
        throw new Error("Failed to create company");
      }

      return await result.json();
    },
    onSuccess: (result) => {
      form.reset();
      setDialogOpen(false);

      toast.success("Success!", {
        description:
          "Account linked successfully. We're redirecting you to the dashboard.",
      });

      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.USER_COMPANIES] });

      router.refresh();

      router.push(redirects.app.company(result.id).root);
    },
    onError: (error) => {
      toast.error("Uh oh! An error occurred.", {
        description: error.message,
      });
    },
  });

  const form = useForm<CreateCompanyFormValues>({
    resolver: zodResolver(CreateCompanyParamsSchema),
    defaultValues: {
      name: "",
    },
  });

  // 2. Define a submit handler.
  function onSubmit(values: CreateCompanyFormValues) {
    // Ensure name is required before passing to the API
    const payload = {
      name: values.name || "",
    };
    mutate(payload);
  }

  return (
    <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
      <DialogTrigger
        className={cn(
          buttonVariants({
            variant: triggerProps?.variant,
            size: triggerProps?.size,
          }),
          triggerProps?.className,
        )}
      >
        {triggerProps?.children || "New"}
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>New Company</DialogTitle>
          <DialogDescription>
            Some stuff about adding a linked account
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className={cn("space-y-4", className)}
            {...props}
          >
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Enter a name for this connection"
                      {...field}
                    />
                  </FormControl>
                  <FormDescription>
                    This name will help you identify this linked account, try to
                    use either your company name or the name used on the third
                    party service you want to link.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit" disabled={isPending} className="w-full">
              {isPending && <Loader2 className="mr-2 animate-spin" />}
              Create Company
            </Button>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
