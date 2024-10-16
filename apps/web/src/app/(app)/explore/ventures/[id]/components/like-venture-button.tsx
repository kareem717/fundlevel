"use client"

import { Button } from "@/components/ui/button"
import { Icons } from "@/components/ui/icons";
import { ComponentPropsWithoutRef, FC } from "react"

export interface LikeVentureButtonProps extends ComponentPropsWithoutRef<typeof Button> {
  ventureId: number;
  accountId: number;
};

export const LikeVentureButton: FC<LikeVentureButtonProps> = ({ ventureId, accountId, ...props }) => {
  return (
    <Button {...props}>
      <Icons.heart className="w-4 h-4 mr-2" />
      Like
    </Button>
  );
};