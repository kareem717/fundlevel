"use client"

import { ComponentPropsWithoutRef, FC, useState } from "react"
import { Business, useBusinessContext } from "./use-business-context";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { toast } from "sonner";

export interface BuisnessContextDialogProps extends ComponentPropsWithoutRef<"div"> {
  businesses: Business[]
};

export const BuisnessContextDialog: FC<BuisnessContextDialogProps> = ({ businesses, ...props }) => {
  const [open, setOpen] = useState(true)
  const { setSelectedBusiness } = useBusinessContext()

  const onSelectBusiness = (businessId: string) => {
    const parsedBusinessId = parseInt(businessId)
    if (isNaN(parsedBusinessId)) {
      toast.error("Invalid business id")
      return
    }

    const selectedBusiness = businesses.find((business) => business.id === parsedBusinessId)
    if (!selectedBusiness) {
      toast.error("Business not found")
      return
    }

    setSelectedBusiness(selectedBusiness)

    setOpen(false)
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Select a business</DialogTitle>
          <DialogDescription>
            Select a business to continue.
          </DialogDescription>
        </DialogHeader>
        <Select onValueChange={onSelectBusiness}>
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Select a business" />
          </SelectTrigger>
          <SelectContent>
            {businesses.map((business) => (
              <SelectItem key={business.id} value={business.id.toString()}>{business.name}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </DialogContent>
    </Dialog>
  );
};