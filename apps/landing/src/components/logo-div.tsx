import { ComponentPropsWithoutRef, FC } from "react";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { redirects, assets } from "@/lib/config";
import Image from "next/image";

interface LogoDivProps extends Omit<ComponentPropsWithoutRef<typeof Link>, "href"> {
  href?: string
}

export const LogoDiv: FC<LogoDivProps> = ({ className, href = redirects.home, ...props }) => {
  return (
    <Link
      className={cn("flex flex-row items-center justify-center text-2xl font-bold hover:cursor-pointer", className)}
      href={href}
      {...props}
    >
      <Image src={assets.logo.large} alt="Fundlevel logo" width={150} height={32} className="object-cover" />
    </Link >
  );
};

export const SmallLogoDiv: FC<LogoDivProps> = ({ className, href = redirects.home, ...props }) => {
  return (
    <Link
      className={cn("flex flex-row items-center justify-center text-2xl font-bold hover:cursor-pointer", className)}
      href={href}
      {...props}
    >
      <Image src={assets.logo.default} alt="Fundlevel logo" width={32} height={32} className="object-cover"/>
    </Link >
  );
};

