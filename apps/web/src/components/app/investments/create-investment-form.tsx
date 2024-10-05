"use client";

import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { toast } from "sonner"
import { ComponentPropsWithoutRef, FC } from "react";
import { Icons } from "@/components/icons";
import { cn } from "@/lib/utils";
import { yupResolver } from '@hookform/resolvers/yup';
import { InferType, number } from "yup";
import { createRoundInvestment } from "@/actions/investments";
import { useAction } from "next-safe-action/hooks";
import { createRoundInvestmentSchema } from "@/lib/validations/investments";

export type RoundInvestmentPrice = number | {
  min: number;
}

export interface CreateInvestmentFormProps extends ComponentPropsWithoutRef<"form"> {
  roundId: number;
  currency: string;
  onSuccess?: () => void;
  price: RoundInvestmentPrice;
}

export const CreateInvestmentForm: FC<CreateInvestmentFormProps> = ({ roundId, currency, onSuccess, className, price, ...props }) => {
  const isFixedPrice = typeof price === "number";

  const formSchema = isFixedPrice ? createRoundInvestmentSchema.shape({
    amount: number().min(price, `Amount must be equal to ${price}`).max(price, `Amount must be equal to ${price}`).required(),
  }) : createRoundInvestmentSchema.shape({
    amount: number().min(price.min, `Amount must be greater than or equal to the minimum amount of ${price.min}`).required(),
  });

  const form = useForm<InferType<typeof formSchema>>({
    resolver: yupResolver(formSchema),
    defaultValues: {
      roundId,
      amount: isFixedPrice ? price : price.min,
    }
  });

  const { executeAsync, isExecuting } = useAction(createRoundInvestment, {
    onSuccess: () => {
      toast.success("Investment created successfully!");
      onSuccess?.();
    },
    onError: ({ error }) => {
      console.log(error);
      toast.error(error.serverError?.message || "Something went wrong");
    }
  });


  async function onSubmit(values: InferType<typeof formSchema>) {
    if (isFixedPrice && values.amount !== price) {
      form.setError("amount", {
        message: "Price is fixed, you cannot change it",
      });
      return;
    }

    await executeAsync({
      ...values,
      amount: isFixedPrice ? price : values.amount,
    });
  }

  return (

    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className={cn("space-y-4", className)} {...props}>
        <FormField
          control={form.control}
          name="amount"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Amount</FormLabel>
              <FormControl>
                <div className="relative mt-1">
                  <Input
                    type="number"
                    min="1"
                    step="1"
                    placeholder="10000"
                    disabled={isFixedPrice}
                    {...field}
                  />
                  <span className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                    {currency.toUpperCase()}
                  </span>
                </div>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" className="w-full flex justify-center items-center" disabled={isExecuting}>
          {isExecuting && <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />} Invest
        </Button>
      </form>
    </Form>
  );
};
