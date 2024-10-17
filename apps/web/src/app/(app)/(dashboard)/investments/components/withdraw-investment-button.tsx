"use client";

import { ComponentPropsWithoutRef, FC } from "react"
import { cn } from "@/lib/utils"
import { Icons } from "@/components/ui/icons";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { useAction } from "next-safe-action/hooks";
import { withdrawInvestment } from "@/actions/investments";

export interface WithdrawInvestmentButtonProps extends ComponentPropsWithoutRef<typeof Button> {
  onSuccess?: () => void
  investmentId: number
}

export const WithdrawInvestmentButton: FC<WithdrawInvestmentButtonProps> = ({ className, onSuccess, investmentId, ...props }) => {

  const { execute, isExecuting } = useAction(withdrawInvestment, {
    onSuccess: () => {
      toast.success("Done!", {
        description: "Your investment has been withdrawn.",
      })
      onSuccess?.()
    },
    onError: ({ error }) => {
      toast.error("Something went wrong", {
        description: error.serverError?.message || "An unknown error occurred",
      })
    }
  })

  const handleWithdraw = () => {
    console.log("withdrawing", investmentId)
    execute(investmentId)
  }

  return (
    <Button onClick={handleWithdraw} disabled={isExecuting} className={cn("w-full", className)} {...props}>
      {isExecuting && (<Icons.spinner className="mr-2 h-4 w-4 animate-spin" />)}
      Withdraw
    </Button>
  )
}