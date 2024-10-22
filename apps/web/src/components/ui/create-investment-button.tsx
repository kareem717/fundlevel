"use client";

import { Button } from "@/components/ui/button";
import { toast } from "sonner"
import { ComponentPropsWithoutRef, FC } from "react";
import { Icons } from "@/components/ui/icons";
import { createInvestment } from "@/actions/investments";
import { useAction } from "next-safe-action/hooks";
import { cn } from "@/lib/utils";

export interface CreateInvestmentButtonProps extends ComponentPropsWithoutRef<"button"> {
  roundId: number;
  onSuccess?: () => void;
}

export const CreateInvestmentButton: FC<CreateInvestmentButtonProps> = ({ roundId, onSuccess, className, ...props }) => {

  const { execute, isExecuting } = useAction(createInvestment, {
    onSuccess: () => {
      toast.success("Investment created successfully!");
      onSuccess?.();
    },
    onError: ({ error }) => {
      console.log(error);
      toast.error(error.serverError?.message || "Something went wrong");
    }
  });


  const handleInvest = () => {
    execute({
      roundId,
    });
  }

  return (
    <Button className={cn("w-full flex justify-center items-center", className)} disabled={isExecuting} onClick={handleInvest} {...props}>
      {isExecuting && <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />} Invest
    </Button>
  );
};
