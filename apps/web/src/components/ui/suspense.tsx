"use client"

import { ComponentPropsWithoutRef, FC, Suspense as ReactSuspense, memo } from "react"
import { Skeleton } from "./skeleton";
import { cn } from "@/lib/utils";

export interface SuspenseProps<T extends React.ElementType = typeof Skeleton> extends ComponentPropsWithoutRef<typeof ReactSuspense> {
  orientation?: "landscape" | "portrait"
  fallback?: React.ReactElement<T>
  fallbackProps?: ComponentPropsWithoutRef<T>
};

export const Suspense: FC<SuspenseProps> = ({
  children,
  orientation = "landscape",
  fallback,
  fallbackProps = {}, // Default to an empty object
  ...props
}) => {
  const aspectRatio = orientation === "landscape" ? "aspect-[16/9]" : "aspect-[9/16]"

  const DefaultFallback = memo(() => (
    <Skeleton
      className={cn(
        "w-full max-w-lg",
        aspectRatio,
        fallbackProps.className
      )}
      {...fallbackProps}
    />
  ));

  return (
    <ReactSuspense fallback={fallback || <DefaultFallback />} {...props}>
      {children}
    </ReactSuspense>
  );
};
