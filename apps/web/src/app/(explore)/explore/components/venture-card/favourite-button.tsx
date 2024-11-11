"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Heart } from "lucide-react";
import { toast } from "sonner";
import { likeVenture } from "@/actions/ventures";
import { useOptimisticAction } from "next-safe-action/hooks";
import { Venture } from "@/lib/api";
import { cn } from "@/lib/utils";
import { Icons } from "@/components/ui/icons";

type FavouriteButtonProps = {
  ventureId: number;
};

export function FavouriteButton({ ventureId }: FavouriteButtonProps) {
  const [isLiked, setIsLiked] = useState<boolean>(false);

  // const { execute, result, optimisticState } = useOptimisticAction(
  //   likeVenture,
  //   {
  //     currentState: false,
  //     updateFn: (state, input) => !state,
  //     onSuccess: () => {
  //       toast.success("Favourited");
  //     },
  //     onError: () => {
  //       toast.error("Failed to favourite");
  //     },
  //     onSettled: () => {
  //       toast.dismiss();
  //     },
  //   }
  // );

  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    setIsLiked(!isLiked);
    toast.success(`${isLiked ? "Unliked" : "Liked"} Venture`);
    // execute(ventureId);
  };

  return (
    <Button variant="outline" size="icon" onClick={handleClick}>
      <Icons.heart
        className={cn(
          "h-4 w-4 text-muted-foreground",
          isLiked && "text-red-500 fill-current"
        )}
      />
    </Button>
  );
}
