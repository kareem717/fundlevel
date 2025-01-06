"use client";

import { useTheme } from "next-themes";
import { Button } from "@repo/ui/components/button";
import { FC } from "react";
import { Moon, Sun } from "lucide-react";

export const ModeToggle: FC = () => {
  const { setTheme, theme } = useTheme();

  const toggleTheme = () => {
    setTheme(theme === "light" ? "dark" : "light");
  };

  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={toggleTheme}
      aria-label="Toggle theme"
    >
      {/* rendering both icons fixes hydration errors */}
      <Moon className="size-5 dark:hidden" />
      <Sun className="hidden size-5 dark:block" />
    </Button>
  );
};
