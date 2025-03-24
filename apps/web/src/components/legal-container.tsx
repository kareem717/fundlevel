import { redirects } from "@fundlevel/web/lib/config/redirects";
import { cn } from "@fundlevel/ui/lib/utils";
import Link from "next/link";
import { ComponentPropsWithoutRef } from "react";

export function LegalContainer({
  className,
  children,
  ...props
}: ComponentPropsWithoutRef<"div">) {
  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      {children}
      <div className="text-balance text-center text-xs text-muted-foreground [&_a]:underline [&_a]:underline-offset-4 [&_a]:hover:text-primary  ">
        By clicking continue, you agree to our{" "}
        <Link href={redirects.compliance.terms}>Terms of Service</Link> and{" "}
        <Link href={redirects.compliance.privacy}>Privacy Policy</Link>.
      </div>
    </div>
  );
}
