import { ComponentPropsWithoutRef } from "react";
import { cn } from "@repo/ui/lib/utils";
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
}

export function NavMenu({
  className,
  config,
  currentPath,
  direction = "row",
  ...props
}: NavMenuProps) {
  return (
    <nav
      className={cn(
        "flex items-center justify-between",
        direction === "column" ? "flex-col w-full" : "flex-row",
        className
      )}
      {...props}
    >
      <ul
        className={cn(
          "flex items-center",
          direction === "column"
            ? "flex-col space-y-4 w-full"
            : "flex-row space-x-4"
        )}
      >
        {config.map((item, index) => (
          <li
            key={index}
            className={cn(
              "hover:text-primary text-md transition-colors",
              direction === "column" && "w-full",
              item.href === currentPath && "text-primary"
            )}
          >
            <Link
              aria-label={item.label}
              href={item.href}
              legacyBehavior
              passHref
              prefetch
              className={cn(
                "block",
                direction === "column" &&
                "w-full py-2 px-4 hover:bg-accent rounded-md"
              )}
            >
              {item.label}
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  );
};
