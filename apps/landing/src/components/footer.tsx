import Link from "next/link";
import { cn } from "@fundlevel/ui/lib/utils";
import { ComponentPropsWithoutRef, FC } from "react";
import { contact } from "@/lib/config";
import { Separator } from "@fundlevel/ui/components/separator";
import { LogoDiv } from "@/components/logo-div";

export function Footer({
  className,
  ...props
}: ComponentPropsWithoutRef<"footer">) {
  return (
    <footer
      className={cn(
        "w-full pb-6 rounded-lg text-card-foreground p-6 shadow-2xl bg-secondary flex flex-col",
        className,
      )}
      {...props}
    >
      <div className="flex flex-col justify-center lg:flex-row md:justify-start gap-12 xl:gap-40">
        <LogoDiv className="w-48 md:w-64" />
      </div>
      <Separator className="my-6 bg-muted-foreground" />
      <div className="flex justify-between items-center w-full">
        <div className="text-sm text-muted-foreground">
          © {new Date().getFullYear()} Fundlevel. All rights reserved.
        </div>
        <div className="flex space-x-4 mt-4 md:mt-0">
          {contact.socials.map((social, index) => (
            <Link
              key={index}
              href={social.link}
              className="text-muted-foreground hover:text-black"
            >
              <social.icon className="size-5" />
              <span className="sr-only">{social.label}</span>
            </Link>
          ))}
        </div>
      </div>
    </footer>
  );
}
