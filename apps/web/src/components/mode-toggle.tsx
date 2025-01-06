"use client"

import { useTheme } from "next-themes"
import { Button } from "@repo/ui/components/button"
import { ComponentPropsWithoutRef, FC } from "react"
import { Icons } from "./icons"

export interface ModeToggleProps extends ComponentPropsWithoutRef<typeof Button> {

}

export const ModeToggle: FC<ModeToggleProps> = ({ ...props }) => {
  const { setTheme, theme } = useTheme()

  const toggleTheme = () => {
    setTheme(theme === "light" ? "dark" : "light");
  }

  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={toggleTheme}
      aria-label="Toggle theme"
      {...props}
    >
      {/* rendering both icons fixes hydration errors */}
      <Icons.moon className="size-5 dark:hidden" />
      <Icons.sun className="size-5 hidden dark:block" />
    </Button>
  )
}
