"use client";

import { AlertCircle, X } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@workspace/ui/components/alert";
import { Button } from "@workspace/ui/components/button";
import { useState, type ReactNode, type ComponentPropsWithoutRef } from "react";
import { cn } from "@workspace/ui/lib/utils";

export interface DismissableAlertProps extends ComponentPropsWithoutRef<typeof Alert> {
  title?: string;
  children: ReactNode;
  variant?: "default" | "destructive";
}

export function DismissableAlert({
  title,
  children,
  variant = "default",
  className,
  ...props
}: DismissableAlertProps) {
  const [isVisible, setIsVisible] = useState(true);

  if (!isVisible) {
    return null;
  }

  return (
    <Alert variant={variant} className={cn("relative", className)} {...props}>
      {title && <AlertTitle>{title}</AlertTitle>}
      <AlertDescription>
        {children}
      </AlertDescription>
      <Button
        size="icon"
        variant="ghost"
        className="absolute right-1 top-1 size-6"
        onClick={() => setIsVisible(false)}
      >
        <X />
        <span className="sr-only">Dismiss</span>
      </Button>
    </Alert>
  );
}
