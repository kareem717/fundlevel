import { ComponentPropsWithoutRef, FC } from "react";
import { cn } from "@/lib/utils";
import { LogoDiv } from "./logo-div";
import Link from "next/link";
import {
    Sheet,
    SheetContent,
    SheetDescription,
    SheetHeader,
    SheetTitle,
    SheetTrigger,
} from "@/components/ui/sheet"
import { Icons } from "./icons";
import { buttonVariants } from "./ui/button";

export type NavigationItem = {
    label: string;
    href: string;
}


interface NavConfigProps {
    config: NavigationItem[];
    currentPath: string;
}

interface NavMenuProps extends ComponentPropsWithoutRef<"nav">, NavConfigProps {
    direction?: "row" | "column";
}

const NavMenu: FC<NavMenuProps> = ({ config, currentPath, direction = "row" }) => {
    return (
        <nav className={cn("flex flex-row items-center justify-between", direction === "column" && "flex-col")}>
            <ul className={
                cn(
                    "flex space-x-4 items-center justify-center",
                    direction === "column" && "flex-col justify-start items-start"
                )}>
                {config.map((item, index) => (
                    <li key={index} className={cn("hover:text-primary text-md", item.href === currentPath && "text-primary")}    >
                        <Link href={item.href} legacyBehavior passHref prefetch>
                            {item.label}
                        </Link>
                    </li>
                ))}
            </ul>
        </nav>
    )
}

export interface NavBarProps extends ComponentPropsWithoutRef<"header">, NavConfigProps { }

export const NavBar: FC<NavBarProps> = ({ className, config, currentPath, ...props }) => {
    return (
        <header className={cn("flex flex-row items-center justify-between w-full bg-background p-4", className)} {...props}>
            <LogoDiv className="justify-start" />
            <NavMenu config={config} currentPath={currentPath} className="hidden sm:flex" />
            <div className="flex-row items-center justify-end gap-4 hidden sm:flex">
                <Link href="#" className={buttonVariants()}>
                    CTA 1
                </Link>
                <Link href="#" className={buttonVariants({ variant: "secondary" })}>
                    CTA 2
                </Link>
            </div>
            <Sheet >
                <SheetTrigger className="sm:hidden">
                    <Icons.menu className="size-6" />
                </SheetTrigger>
                <SheetContent>
                    <SheetHeader>
                        <SheetTitle>Are you absolutely sure?</SheetTitle>
                        <SheetDescription>
                        </SheetDescription>
                    </SheetHeader>
                    <NavMenu
                        config={config}
                        currentPath={currentPath}
                        direction="column"
                    />
                </SheetContent>
            </Sheet>
        </header>
    )
}
