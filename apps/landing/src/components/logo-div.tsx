import { ComponentPropsWithoutRef, FC } from "react";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { redirects } from "@/lib/config";

interface LogoDivProps extends Omit<ComponentPropsWithoutRef<typeof Link>, "href"> {
  href?: string
}

export const LogoDiv: FC<LogoDivProps> = ({ className, href = redirects.home, ...props }) => {
  return (
    <Link
      className={cn("flex flex-row items-center justify-center text-2xl font-bold", className)}
      href={href}
      {...props}
    >
      <span className="tracking-tight hover:cursor-pointer">
        fund
        <span className="text-primary">level</span>
      </span>
    </Link >
  );
};

export const SmallLogoDiv: FC<LogoDivProps> = ({ className, href = redirects.home, ...props }) => {
  return (
    <Link
      className={cn("flex flex-row items-center justify-center text-2xl font-bold", className)}
      href={href}
      {...props}
    >
      <span className="tracking-tight hover:cursor-pointer">
        f
        <span className="text-primary">l</span>
      </span>
    </Link >
  );
};

