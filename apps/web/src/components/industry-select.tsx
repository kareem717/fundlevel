"use client";

import { ComponentPropsWithoutRef, FC, useEffect, useState } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@workspace/ui/components/select";
import { cn } from "@workspace/ui/lib/utils";
import { Industry } from "@workspace/sdk";
import { useAction } from "next-safe-action/hooks";
import { getAllIndustries } from "@/actions/industries";
import { useToast } from "@workspace/ui/hooks/use-toast";
import { Icons } from "./icons";

export interface IndustrySelectProps
  extends Omit<ComponentPropsWithoutRef<typeof Select>, "onValueChange"> {
  triggerProps?: ComponentPropsWithoutRef<typeof SelectTrigger>;
  onValueChange?: (value: number[]) => void;
}

//TODO: make multi select
export function IndustrySelect({
  triggerProps,
  onValueChange,
  ...props
}: IndustrySelectProps) {
  const [industries, setIndustries] = useState<Industry[]>([]);
  const { toast } = useToast();

  const { execute, isExecuting } = useAction(getAllIndustries, {
    onSuccess: ({ data }) => {
      setIndustries(data?.industries ?? []);
    },
    onError: (error) => {
      console.error(error);
      toast({
        title: "Failed to fetch industries",
        description:
          error.error.serverError?.message ?? "An unknown error occurred",
        variant: "destructive",
      });
    },
  });

  useEffect(() => {
    execute();
  }, [execute]);

  return (
    <Select
      {...props}
      onValueChange={(value) => {
        onValueChange?.(value.split(",").map(Number));
      }}
    >
      <SelectTrigger className={cn(triggerProps?.className)} {...triggerProps}>
        <SelectValue placeholder="Select an industry" />
      </SelectTrigger>
      <SelectContent>
        {isExecuting ? (
          <span className="flex items-center justify-center">
            <Icons.spinner className="size-4 animate-spin" />
          </span>
        ) : (
          industries.map((industry) => (
            <SelectItem key={industry.id} value={industry.id.toString()}>
              {industry.label}
            </SelectItem>
          ))
        )}
      </SelectContent>
    </Select>
  );
}
