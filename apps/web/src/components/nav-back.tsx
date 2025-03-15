"use client"

import { ComponentPropsWithoutRef, FC } from "react"
import { cn } from "@workspace/ui/lib/utils";
import { Icons } from "./icons";
import { Button } from "@workspace/ui/components/button";
import { useRouter } from "next/navigation";

export interface NavBackProps extends ComponentPropsWithoutRef<typeof Button> {
};

export const NavBack: FC<NavBackProps> = ({ children, ...props }) => {
  const router = useRouter();

  const handleClick = () => {
    router.back();
  };

  return (
    <Button
      variant="ghost"
      size="sm"
      {...props}
      onClick={handleClick}
    >
      {children ?? (
        <>
          <Icons.arrowLeft className="w-4 h-4 mr-2" />
          Back
        </>
      )}
    </Button>
  );
};