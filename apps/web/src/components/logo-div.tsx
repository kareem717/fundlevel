import { ComponentPropsWithoutRef, FC } from "react";
import { cn } from "@repo/ui/lib/utils";
import Link from "next/link";
import { redirects } from "@/lib/config/redirects";
import { Icons } from "./icons";

interface LogoDivProps extends Omit<ComponentPropsWithoutRef<typeof Link>, "href"> {
  href?: string
}

export const LogoDiv: FC<LogoDivProps> = ({ className, href = redirects.app.index, ...props }) => {
  return (
    <Link
      className={cn("flex flex-row items-center justify-center text-2xl font-bold hover:cursor-pointer w-40", className)}
      href={href}
      {...props}
    >
      <Icons.logo className="w-full h-auto fill-foreground" />
    </Link >
  );
};

export const SmallLogoDiv: FC<LogoDivProps> = ({ className, href = redirects.app.index, ...props }) => {
  return (
    <Link
      className={cn("flex flex-row items-center justify-center text-2xl font-bold hover:cursor-pointer", className)}
      href={href}
      {...props}
    >
      <Icons.smallLogo className="size-9 fill-foreground" />
    </Link >
  );
};

