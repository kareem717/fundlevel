import {
  SidebarMenuButton,
} from "@workspace/ui/components/sidebar"
import { ComponentPropsWithoutRef } from "react"
import { redirects } from "@/lib/config/redirects"
import { Icons } from "@/components/icons"
import Link from "next/link"

export interface SidebarLogoProps extends ComponentPropsWithoutRef<typeof SidebarMenuButton> {
  redirect?: string | boolean
}

export function SidebarLogo({ redirect = redirects.app.root, ...props }: SidebarLogoProps) {
  return (
    <SidebarMenuButton size="lg" asChild {...props}>
      {redirect && typeof redirect === "string" ? (
        <Link href={redirect}>
          <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground">
            <Icons.smallLogo className="size-6 fill-foreground" />
          </div>
          <div className="grid flex-1 text-left text-2xl leading-tight">
            <span className="truncate font-bold">Fundlevel</span>
          </div>
        </Link>
      ) : (
        <div className="flex flex-row items-center">
          <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground">
            <Icons.smallLogo className="size-6 fill-foreground" />
          </div>
          <div className="grid flex-1 text-left text-2xl leading-tight">
            <span className="truncate font-bold">Fundlevel</span>
          </div>
        </div>
      )}
    </SidebarMenuButton>
  )
}
