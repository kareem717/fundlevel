
"use client"

import { RoundInvestment } from "@/lib/api";
import { ComponentPropsWithoutRef, FC } from "react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button";

export interface ManageInvestmentDialogProps extends ComponentPropsWithoutRef<"div"> {
  investment: RoundInvestment
};

export const ManageInvestmentDialog: FC<ManageInvestmentDialogProps> = ({ investment, ...props }) => {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button className="w-full">
          Manage
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Manage Investment</DialogTitle>
          <DialogDescription>
            Manage your investment in this round.
          </DialogDescription>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
};