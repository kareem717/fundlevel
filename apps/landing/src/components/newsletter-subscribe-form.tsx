"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { useAction } from "next-safe-action/hooks";
import { subscribeToNewsletter } from "@fundlevel/landing/actions/mail";
import { Button } from "@fundlevel/ui/components/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@fundlevel/ui/components/form";
import { Input } from "@fundlevel/ui/components/input";
import type { ComponentPropsWithoutRef, FC } from "react";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";

const formSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
});

export interface NewsletterSubscribeFormProps
  extends ComponentPropsWithoutRef<"form"> {
  className?: string;
  buttonClassName?: string;
  inputClassName?: string;
}

export const NewsletterSubscribeForm: FC<NewsletterSubscribeFormProps> = ({
  className,
  buttonClassName,
  inputClassName,
  ...props
}) => {
  const { execute, isExecuting } = useAction(subscribeToNewsletter, {
    onSuccess: () => {
      form.reset();
      toast.success("You are now subscribed to our newsletter!");
    },
    onError: () => {
      toast.error("Failed to subscribe to our newsletter.", {
        action: {
          label: "Retry",
          onClick: () => {
            execute(form.getValues().email);
          },
        },
      });
    },
  });

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
    },
  });

  const onSubmit = (values: z.infer<typeof formSchema>) => {
    if (isExecuting) return;
    execute(values.email);
  };

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className={className}
        {...props}
      >
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem className="w-full">
              <FormControl>
                <Input
                  placeholder="you@example.com"
                  {...field}
                  className={inputClassName}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button
          type="submit"
          disabled={isExecuting}
          className={buttonClassName}
          aria-label="Subscribe"
        >
          {isExecuting && <Loader2 className="w-4 h-4 animate-spin" />}
          Subscribe
        </Button>
      </form>
    </Form>
  );
};
