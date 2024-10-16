"use client";

import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import {
  Form,
} from "@/components/ui/form";
import { toast } from "sonner"
import { ComponentPropsWithoutRef, FC } from "react";
import { Icons } from "@/components/ui/icons";
import { cn } from "@/lib/utils";
import { yupResolver } from '@hookform/resolvers/yup';
import { InferType, number } from "yup";
import { createInvestment } from "@/actions/investments";
import { useAction } from "next-safe-action/hooks";
import { createInvestmentSchema } from "@/actions/validations/investments";

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
  const form = useForm<InferType<typeof createInvestmentSchema>>({
    resolver: yupResolver(createInvestmentSchema),
    defaultValues: {
      roundId,
    }
  });

  const { executeAsync, isExecuting } = useAction(createInvestment, {
    onSuccess: () => {
      toast.success("Investment created successfully!");
      onSuccess?.();
    },
    onError: ({ error }) => {
      console.log(error);
      toast.error(error.serverError?.message || "Something went wrong");
    }
  });


  async function onSubmit(values: InferType<typeof createInvestmentSchema>) {
    await executeAsync({
      ...values,
    });
  }

  return (

    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className={cn("space-y-4", className)} {...props}>
        <Button type="submit" className="w-full flex justify-center items-center" disabled={isExecuting}>
          {isExecuting && <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />} Invest
        </Button>
      </form>
    </Form>
  );
};
