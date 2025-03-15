import { ComponentPropsWithoutRef, FC, ReactNode } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@workspace/ui/components/select";
import { cn } from "@workspace/ui/lib/utils";

export type Unit = {
  value: string;
  label: string;
  icon: ReactNode;
};

interface UnitSelectProps extends ComponentPropsWithoutRef<typeof Select> {
  availableUnits: Unit[];
  triggerProps?: ComponentPropsWithoutRef<typeof SelectTrigger>;
}

export const UnitSelect: FC<UnitSelectProps> = ({
  availableUnits = [],
  triggerProps,
  ...props
}) => {
  if (availableUnits.length < 1) {
    throw new Error("No units provided");
  }

  const isSelectDisabled = availableUnits.length === 1;

  return (
    <Select
      defaultValue={availableUnits[0]?.value}
      disabled={isSelectDisabled}
      {...props}
      onValueChange={(value) => {
        console.log(value);
        props.onValueChange?.(value);
      }}
    >
      <SelectTrigger
        className={cn(
          "w-min",
          isSelectDisabled && "opacity-50 cursor-not-allowed",
        )}
        {...triggerProps}
      >
        <SelectValue />
      </SelectTrigger>
      <SelectContent>
        {availableUnits.map((unit) => (
          <SelectItem key={unit.value} value={unit.value}>
            <div className="flex items-center">
              {unit.icon}
              <span className="ml-2">{unit.label}</span>
            </div>
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
};
