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
} from "@/components/ui/form";
import { ComponentPropsWithoutRef, FC, useEffect, useState } from "react";
import { Icons } from "@/components/ui/icons";
import { cn } from "@/lib/utils";
import { yupResolver } from '@hookform/resolvers/yup';
import { boolean, InferType, object } from "yup";
import { Checkbox } from "@/components/ui/checkbox";
import { useInView } from "react-intersection-observer";
import { useCheckoutFormStore } from "./checkout-form";
import { toast } from "sonner";

export interface ConfirmationFormProps extends ComponentPropsWithoutRef<"div"> {
}

const confirmationSchema = object().shape({
  confirmed: boolean().required().oneOf([true], "You must confirm the investment"),
});

export const ConfirmationForm: FC<ConfirmationFormProps> = ({ className, ...props }) => {
  const [isExecuting, setIsExecuting] = useState(false);
  const form = useForm<InferType<typeof confirmationSchema>>({
    resolver: yupResolver(confirmationSchema)
  });
  const { triggerSubmit, error } = useCheckoutFormStore();

  useEffect(() => {
    if (error) {
      console.log('error', error.message);
    }
  }, [error]);

  async function onSubmit(values: InferType<typeof confirmationSchema>) {
    console.log(values)
    setIsExecuting(true);
    await triggerSubmit();
    if (error) {
      toast.error("An error occurred while processing your payment.");
      console.error('error', error.message);
    }
    setTimeout(() => {
      console.log("done")
    }, 1000);
    setIsExecuting(false);
  }

  const { ref, inView } = useInView({
    threshold: 0.5,
  });

  return (
    <div className={cn(className)} {...props}>
      <div ref={ref} />
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <FormField
            control={form.control}
            name="confirmed"
            render={({ field }) => (
              <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4 shadow">
                <FormControl>
                  <Checkbox
                    checked={field.value}
                    onCheckedChange={field.onChange}
                    disabled={!inView || isExecuting}
                  />
                </FormControl>
                <div className="space-y-1 leading-none">
                  <FormLabel>
                    I have read and agree to the disclaimer
                  </FormLabel>
                  <FormDescription>
                    By selecting the button below, I agree to the Host&apos;s House Rules, Ground rules for guests, Airbnb&apos;s Rebooking and Refund Policy, and that Airbnb can charge my payment method if I&apos;m responsible for damage. I agree to pay the total amount shown if the Host accepts my booking request.
                  </FormDescription>
                </div>
              </FormItem>
            )}
          />
          <Button
            type="submit"
            className="w-full flex justify-center items-center"
            disabled={isExecuting || !form.formState.isValid}
          >
            {isExecuting && <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />}  Continue to payment
          </Button>
        </form>
      </Form>
    </div>
  );
};
