"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useHookFormAction } from "@next-safe-action/adapter-react-hook-form/hooks";
import { z } from "zod";
import { createLinkTokenAction, swapPublicTokenAction } from "@/actions/linked-account";
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
import { useMergeLink } from "@mergeapi/react-merge-link";
import { useCallback, useState, type ComponentPropsWithoutRef } from "react";
import { useToast } from "@fundlevel/ui/hooks/use-toast";
import { useAction } from "next-safe-action/hooks";
import { cn } from "@fundlevel/ui/lib/utils";
import { Loader2 } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@fundlevel/ui/components/dialog"

// Define the schema for the form - matches the schema in createLinkTokenAction
const linkAccountSchema = z.object({
  name: z.string().min(1, {
    message: "Name is required",
  }),
});

export function LinkAccountDialog({ className, ...props }: Omit<ComponentPropsWithoutRef<'form'>, "onSubmit">) {
  const [linkToken, setLinkToken] = useState<string | null>(null);
  const [dialogOpen, setDialogOpen] = useState<boolean>(false);

  const { toast } = useToast();

  const { execute, isExecuting: isSwapping } = useAction(swapPublicTokenAction);
  const onSuccess = useCallback((public_token: string) => {
    execute({ publicToken: public_token });
  }, []);

  const { open } = useMergeLink({
    linkToken: linkToken || undefined,
    onSuccess,
  });

  // Use the adapter hook to connect the form with the action
  const { form, handleSubmitWithAction, action: { isExecuting: isGenerating } } = useHookFormAction(
    createLinkTokenAction,
    zodResolver(linkAccountSchema),
    {
      formProps: {
        defaultValues: {
          name: "",
        },
      },
      actionProps: {
        onSuccess: (result) => {
          if (!result?.data?.linkToken) {
            return toast({
              variant: "destructive",
              title: "Uh oh!",
              description: "An error occurred",
            })
          }
          setLinkToken(result.data?.linkToken);
          open();
        },
        onError: (errorResult) => {
          return toast({
            variant: "destructive",
            title: "Uh oh!",
            description: "An error occurred",
          })
        },
      },
    }
  );

  const isLoading = isGenerating || isSwapping;

  return (
    <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
      <DialogTrigger className={buttonVariants()}>
        Link Account
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Link account</DialogTitle>
          <DialogDescription>
            This action cannot be undone. This will permanently delete your account
            and remove your data from our servers.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={handleSubmitWithAction} className={cn("space-y-4", className)} {...props}>
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Integration Name</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter a name for this connection" {...field} />
                  </FormControl>
                  <FormDescription>
                    This name will help you identify this integration later.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit" disabled={isLoading} className="w-full">
              {isLoading && <Loader2 className="mr-2 animate-spin" />}
              Link
            </Button>
          </form>
        </Form >
      </DialogContent>
    </Dialog>
  );
}
