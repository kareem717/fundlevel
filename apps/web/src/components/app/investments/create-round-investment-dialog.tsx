"use client"

import { ComponentPropsWithoutRef, FC, useState, ReactNode, cloneElement, ReactElement } from "react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"

interface SuccessCallbackForm {
  onSuccess: () => void;
}

export interface CreateRoundInvestmentDialogProps extends ComponentPropsWithoutRef<typeof Dialog> {
  roundId: number;
  children: ReactElement<SuccessCallbackForm>;
};

export const CreateRoundInvestmentDialog: FC<CreateRoundInvestmentDialogProps> = ({ children, ...props }) => {
  const [open, setOpen] = useState(false);

  const handleSuccess = () => {
    setOpen(false);
  }

  const childWithProps = cloneElement(children, { onSuccess: handleSuccess });

  return (
    <Dialog {...props} open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>
          Invest
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Invest in Round</DialogTitle>
          <DialogDescription>
            yap yap yap.....
          </DialogDescription>
        </DialogHeader>
        {childWithProps}
      </DialogContent>
    </Dialog>
  );
};