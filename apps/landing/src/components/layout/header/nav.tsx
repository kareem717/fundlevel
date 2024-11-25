import { ComponentPropsWithoutRef, FC } from "react";
import { cn } from "@/lib/utils";
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

export const NavMenu: FC<NavMenuProps> = ({
  config,
  currentPath,
  direction = "row",
}) => {
  return (
    <nav
      className={cn(
        "flex flex-row items-center justify-between",
        direction === "column" && "flex-col"
      )}
    >
      <ul
        className={cn(
          "flex space-x-4 items-center justify-center",
          direction === "column" && "flex-col justify-start items-start"
        )}
      >
        {config.map((item, index) => (
          <li
            key={index}
            className={cn(
              "hover:text-primary text-md",
              item.href === currentPath && "text-primary"
            )}
          >
            <Link href={item.href} legacyBehavior passHref prefetch>
              {item.label}
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  );
};
