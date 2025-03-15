"use client";

import { ComponentPropsWithoutRef, FC } from "react";
import { Input } from "@fundlevel/ui/components/input";
import { Button } from "@fundlevel/ui/components/button";
import { Icons } from "./icons";
import { cn } from "@fundlevel/ui/lib/utils";

export interface QuickSearchProps extends ComponentPropsWithoutRef<"div"> {
  inputProps?: ComponentPropsWithoutRef<typeof Input>;
}

export const QuickSearch: FC<QuickSearchProps> = ({
  className,
  inputProps,
  ...props
}) => {
  return (
    <div className={cn("flex items-center gap-2", className)} {...props}>
      <Input
        className={cn("w-full", inputProps?.className)}
        {...inputProps}
        placeholder="Search"
      />
      <Button size="icon" className="aspect-square">
        <Icons.search />
      </Button>
    </div>
  );
};
