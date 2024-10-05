"use client"

import { useTheme } from "next-themes"
import { Button } from "@/components/ui/button"
import { FC } from "react"
import { Icons } from "./icons"

export const ModeToggle: FC = () => {
  const { setTheme, resolvedTheme } = useTheme()

  const toggleTheme = () => {
    setTheme(resolvedTheme === "light" ? "dark" : "light")
  }

  return (
    <Button variant="ghost" size="icon" onClick={toggleTheme}>
      {
        resolvedTheme === "light" ?
          <Icons.sun className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0 text-foreground" /> :
          <Icons.moon className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100 text-foreground" />
      }
      <span className="sr-only">Toggle theme</span>
    </Button>
  )
}
