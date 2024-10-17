"use client"

import { ComponentPropsWithoutRef, FC } from "react"
import { cn } from "@/lib/utils";
import { Icons } from "./icons";
import { Button } from "./button";
import { useRouter } from "next/navigation";

export interface NavBackProps extends ComponentPropsWithoutRef<typeof Button> {
};

export const NavBack: FC<NavBackProps> = ({ className, ...props }) => {
  const router = useRouter();

  const handleClick = () => {
    router.back();
  };

  return (
    <Button
      className={cn("text-muted-foreground", className)}
      {...props}
      onClick={handleClick}
      variant="ghost"
      size="sm"
    >
      <Icons.arrowLeft className="w-4 h-4 mr-2" />
      Back
    </Button>
  );
};