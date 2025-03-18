import { ComponentPropsWithoutRef } from "react";
import { cn } from "@fundlevel/ui/lib/utils";
import Link from "next/link";

export type NavigationItem = {
  label: string;
  href: string;
};

interface NavConfigProps {
  config: NavigationItem[];
  currentPath: string;
}

interface NavMenuProps extends ComponentPropsWithoutRef<"nav">, NavConfigProps {
  direction?: "row" | "column";
  onClick?: () => void;
}

export function NavMenu({
  className,
  config,
  currentPath,
  direction = "row",
  onClick,
  ...props
}: NavMenuProps) {
  return (
    <nav
      className={cn(
        "flex items-center justify-between",
        direction === "column" ? "flex-col w-full" : "flex-row",
        className,
      )}
      {...props}
    >
      <ul
        className={cn(
          "flex items-center",
          direction === "column"
            ? "flex-col space-y-4 w-full"
            : "flex-row space-x-4",
        )}
      >
        {config.map((item, index) => (
          <Link
            aria-label={item.label}
            key={index}
            href={item.href}
            onClick={onClick}
            legacyBehavior
            passHref
            prefetch
            className={cn(
              "block",
              direction === "column" &&
                "w-full py-2 px-4 hover:bg-accent rounded-md",
            )}
          >
            {item.label}
          </Link>
        ))}
      </ul>
    </nav>
  );
}
