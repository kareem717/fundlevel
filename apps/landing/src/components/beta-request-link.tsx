import { env } from "@/env";
import { Button, buttonVariants } from "@workspace/ui/components/button";
import { cn } from "@workspace/ui/lib/utils";
import Link from "next/link";
import { ComponentPropsWithoutRef } from "react";

export interface BetaRequestLinkProps
  extends Omit<ComponentPropsWithoutRef<typeof Link>, 'href'> {
  variant?: ComponentPropsWithoutRef<typeof Button>['variant'];
  size?: ComponentPropsWithoutRef<typeof Button>['size'];
}

export function BetaRequestLink({
  variant = "default",
  size = "default",
  children,
  className,
  ...props
}: BetaRequestLinkProps) {
  return (
    <Link
      href={env.NEXT_PUBLIC_BETA_REQUEST_LINK}
      aria-label="Request Beta Access"
      className={cn(buttonVariants({ variant, size }), className)}
      {...props}
    >
      {children || "Request Beta Access"}
    </Link>
  );
}

