"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useHookFormAction } from "@next-safe-action/adapter-react-hook-form/hooks";
import { createCompanyAction } from "@/actions/company";
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
import { useState, type ComponentPropsWithoutRef } from "react";
import { useToast } from "@fundlevel/ui/hooks/use-toast";
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
import { createCompanytSchema } from "@fundlevel/api/types";
import { useRouter } from "next/navigation";
import { redirects } from "@/lib/config/redirects";

interface CreateCompanyDialogProps
  extends Omit<ComponentPropsWithoutRef<"form">, "onSubmit"> {
  triggerProps?: ComponentPropsWithoutRef<typeof Button>;
}

export function CreateCompanyDialog({
  className,
  triggerProps,
  ...props
}: CreateCompanyDialogProps) {
  const { toast } = useToast();
  const router = useRouter();
  const [dialogOpen, setDialogOpen] = useState(false);

  // Use the adapter hook to connect the form with the action
  const {
    form,
    handleSubmitWithAction,
    action: { isExecuting },
  } = useHookFormAction(
    createCompanyAction,
    zodResolver(createCompanytSchema),
    {
      formProps: {
        defaultValues: {
          name: "",
          email: "",
        },
      },
      actionProps: {
        onSuccess: (result) => {
          if (!result?.data) {
            return toast({
              variant: "destructive",
              title: "Uh oh!",
              description: "An unkown error occurred.",
            });
          }

          form.reset();
          setDialogOpen(false);

          toast({
            title: "Success!",
            description:
              "Account linked successfully. We're redirecting you to the dashboard.",
          });

          router.push(redirects.app.company(result.data.id).root);
        },
        onError: (errorResult) => {
          return toast({
            variant: "destructive",
            title: "Uh oh!",
            description: "An unkown error occurred.",
          });
        },
      },
    },
  );

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
        {triggerProps?.children || "Add Account"}
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add linked account</DialogTitle>
          <DialogDescription>
            Some stuff about adding a linked account
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form
            onSubmit={handleSubmitWithAction}
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
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Organization Email</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Enter a name for this connection"
                      {...field}
                    />
                  </FormControl>
                  <FormDescription>
                    Use either the same email you use on the party services
                    (i.e. QuickBooks) you want to link.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit" disabled={isExecuting} className="w-full">
              {isExecuting && <Loader2 className="mr-2 animate-spin" />}
              Add Account
            </Button>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
