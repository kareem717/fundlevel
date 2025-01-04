import { ComponentPropsWithoutRef, FC } from "react";
import { cn } from "@repo/ui/lib/utils";
import Link from "next/link";
import { redirects } from "@/lib/config";
import { LogoIcon } from "@repo/ui/icons";

interface LogoDivProps
  extends Omit<ComponentPropsWithoutRef<typeof Link>, "href"> {
  href?: string;
}

export const LogoDiv: FC<LogoDivProps> = ({
  className,
  href = redirects.home,
  ...props
}) => {
  return (
    <Link
      className={cn(
        "flex flex-row items-center justify-center text-2xl font-bold hover:cursor-pointer w-52",
        className
      )}
      href={href}
      {...props}
    >
      <LogoIcon className="w-full h-auto fill-foreground" />
    </Link>
  );
};

export const SmallLogoDiv: FC<LogoDivProps> = ({
  className,
  href = redirects.home,
  ...props
}) => {
  return (
    <Link
      className={cn(
        "flex flex-row items-center justify-center text-2xl font-bold hover:cursor-pointer",
        className
      )}
      href={href}
      {...props}
    >
      <Icons.smallLogo className="size-9 fill-foreground" />
    </Link>
  );
};
