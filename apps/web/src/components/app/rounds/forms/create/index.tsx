"use client";

import { ComponentPropsWithoutRef, FC, useState, ReactNode } from "react"
import { CreateFixedTotalRoundForm } from "./create-fixed-total-form";
import { CreatePartialTotalRoundForm } from "./create-partial-total-form";
import { CreateRegularDynamicRoundForm } from "./create-regular-dynamic-form";
import { CreateDutchDynamicRoundForm } from "./create-dutch-dynamic-form";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import { cn } from "@/lib/utils";

export type RoundType = "fixed-total" | "partial-total" | "regular-dynamic" | "dutch-dynamic";

export interface CreateRoundFormProps extends ComponentPropsWithoutRef<"div"> {
  roundType?: RoundType;  
  onSuccess?: () => void;
};

export const CreateRoundForm: FC<CreateRoundFormProps> = ({ roundType: initialRoundType, className, onSuccess, ...props }) => {
  const [roundType, setRoundType] = useState<RoundType | "">(initialRoundType || "");

  let Form: ReactNode; // {{ edit_1 }} Define Form as ReactNode

  // switch
  switch (roundType) {
    case "fixed-total":
      Form = <CreateFixedTotalRoundForm onSuccess={onSuccess} />;
      break;
    case "partial-total":
      Form = <CreatePartialTotalRoundForm onSuccess={onSuccess} />;
      break;
    case "regular-dynamic":
      Form = <CreateRegularDynamicRoundForm onSuccess={onSuccess} />;
      break;
    case "dutch-dynamic":
      Form = <CreateDutchDynamicRoundForm onSuccess={onSuccess} />;
      break;
  }

  return (
    <div className={cn("flex flex-col gap-4", className)} {...props}>
      <TooltipProvider>
        <ToggleGroup 
          variant={"outline"} 
          size={"lg"} 
          type="single" 
          value={roundType} 
          onValueChange={(value) => setRoundType(value as RoundType)}
          className="grid grid-cols-2 gap-4"
        >
          <Tooltip>
            <TooltipTrigger asChild>
              <ToggleGroupItem value="fixed-total" aria-label="Toggle bold" className={cn(roundType === "fixed-total" && "bg-secondary")}>
                Fixed Total
              </ToggleGroupItem>
            </TooltipTrigger>
            <TooltipContent>
              <p>Add to library</p>
            </TooltipContent>
          </Tooltip>
          <Tooltip>
            <TooltipTrigger asChild>
              <ToggleGroupItem value="partial-total" aria-label="Toggle bold" className={cn(roundType === "partial-total" && "bg-secondary")}>
                Partial Total
              </ToggleGroupItem>
            </TooltipTrigger>
            <TooltipContent>
              <p>Add to library</p>
            </TooltipContent>
          </Tooltip>
          <Tooltip>
            <TooltipTrigger asChild>
              <ToggleGroupItem value="regular-dynamic" aria-label="Toggle bold" className={cn(roundType === "regular-dynamic" && "bg-secondary")}>
                Regular Dynamic
              </ToggleGroupItem>
            </TooltipTrigger>
            <TooltipContent>
              <p>Add to library</p>
            </TooltipContent>
          </Tooltip>
          <Tooltip>
            <TooltipTrigger asChild>
              <ToggleGroupItem value="dutch-dynamic" aria-label="Toggle bold" className={cn(roundType === "dutch-dynamic" && "bg-secondary")}>
                Dutch Dynamic
              </ToggleGroupItem>
            </TooltipTrigger>
            <TooltipContent>
              <p>Add to library</p>
            </TooltipContent>
          </Tooltip>
        </ToggleGroup>
      </TooltipProvider>

      {roundType && (
        Form
      )}
    </div>
  );
};