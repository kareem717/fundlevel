"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import { Heart } from "lucide-react";
import { toast } from "sonner";
import { likeVenture } from "@/actions/ventures";
import { useOptimisticAction } from "next-safe-action/hooks";
import { Venture } from "@/lib/api";

type FavouriteButtonProps = {
  ventureId: number;
};

export function FavouriteButton({ ventureId }: FavouriteButtonProps) {
  const { execute, result, optimisticState } = useOptimisticAction(
    likeVenture,
    {
      currentState: false,
      updateFn: (state, input) => !state,
      onSuccess: () => {
        toast.success("Favourited");
      },
      onError: () => {
        toast.error("Failed to favourite");
      },
      onSettled: () => {
        toast.dismiss();
      },
    }
  );

  const handleClick = () => {
    execute(ventureId);
  };

  return (
    <Button variant="outline" size="icon" onClick={handleClick}>
      {optimisticState ? (
        <Heart className="h-4 w-4 text-red-500" />
      ) : (
        <Heart className="h-4 w-4 text-red-500" />
      )}
    </Button>
  );
}
