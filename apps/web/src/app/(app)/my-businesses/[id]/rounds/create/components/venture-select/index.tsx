import { ComponentPropsWithoutRef, FC } from "react"
import {
  Select,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { VentureSelectItems } from "./items";
import { cn } from "@/lib/utils";

export interface VentureSelectProps extends ComponentPropsWithoutRef<typeof Select> {
  triggerProps?: ComponentPropsWithoutRef<typeof SelectTrigger>
  businessId: number;
};

export const VentureSelect: FC<VentureSelectProps> = ({ triggerProps, businessId, ...props }) => {
  return (
    <Select {...props}>
      <SelectTrigger className={cn("w-full", triggerProps?.className)} {...triggerProps}>
        <SelectValue placeholder="Select a venture" />
      </SelectTrigger>
      <VentureSelectItems businessId={businessId} />
    </Select>
  );
};