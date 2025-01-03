"use client";

import { useTheme } from "next-themes";
import { Button } from "@/components/ui/button";
import { FC } from "react";
import { Icons } from "@/components/ui/icons";
import React from "react";

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
      <Icons.moon className="size-5 dark:hidden" />
      <Icons.sun className="hidden size-5 dark:block" />
    </Button>
  );
};
