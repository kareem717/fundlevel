import { ComponentPropsWithoutRef, FC } from "react";
import { cn } from "@repo/ui/lib/utils";
import Link from "next/link";
import { redirects } from "@/lib/config";
import { LogoIcon, SmallLogoIcon } from "@/components/icons";
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
      aria-label="Redirect to home"
      className={cn(
        "w-52",
        className
      )}
      href={href}
      {...props}
    >
      <LogoIcon className="h-min fill-foreground" />
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
      aria-label="Redirect to home"
      className={cn(
        "flex flex-row items-center justify-center text-2xl font-bold hover:cursor-pointer",
        className
      )}
      href={href}
      {...props}
    >
      <SmallLogoIcon className="size-9 fill-foreground" />
    </Link>
  );
};
