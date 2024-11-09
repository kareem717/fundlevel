"use client"

import { cn } from "@/lib/utils";
import { ComponentPropsWithoutRef, FC, useState } from "react"
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { CreateInvestmentButton } from "@/components/create-investment-button";

export interface ConfirmInvestmentDialogProps extends ComponentPropsWithoutRef<typeof Dialog> {
  roundId: number;
  price?: number;
  buttonProps?: ComponentPropsWithoutRef<typeof Button>;
}

export const ConfirmInvestmentDialog: FC<ConfirmInvestmentDialogProps> = ({ roundId, price, buttonProps, ...props }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen} {...props}>
      <DialogTrigger asChild className="w-1/2">
        <Button className={cn("w-full", buttonProps?.className)} {...buttonProps}>
          Invest{price && ` for $${price}`}
        </Button>
      </DialogTrigger>
      <DialogContent className="w-[95vw] max-w-md rounded-md">
        <DialogHeader>
          <DialogTitle>Confirm Investment</DialogTitle>
          <DialogDescription>
            This will begin the investment process. If your investment offer is accepted, you will be able to complete the payment.
          </DialogDescription>
        </DialogHeader>
        <CreateInvestmentButton roundId={roundId} onSuccess={() => setIsOpen(false)} />
      </DialogContent>
    </Dialog>
  );
}
