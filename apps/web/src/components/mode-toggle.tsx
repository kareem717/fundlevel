"use client";

import { useTheme } from "next-themes";
import { ComponentPropsWithoutRef } from "react";
import { Sun, Moon } from "lucide-react";
import {
  ToggleGroup,
  ToggleGroupItem,
} from "@workspace/ui/components/toggle-group";
import { cn } from "@workspace/ui/lib/utils";

export function ModeToggle({
  className,
  ...props
}: Omit<
  ComponentPropsWithoutRef<typeof ToggleGroup>,
  "defaultValue" | "onValueChange" | "value" | "type"
>) {
  const { setTheme, resolvedTheme } = useTheme();

  return (
    <ToggleGroup
      {...props}
      type="single"
      onValueChange={setTheme}
      value={resolvedTheme}
      className={cn("[&>*]:w-full", className)}
    >
      <ToggleGroupItem value="light" aria-label="Toggle light">
        <Sun className="h-4 w-4" />
      </ToggleGroupItem>
      <ToggleGroupItem value="dark" aria-label="Toggle dark">
        <Moon className="h-4 w-4" />
      </ToggleGroupItem>
    </ToggleGroup>
  );
}
