"use client"

import { isVentureLiked, likeVenture, unlikeVenture } from "@/actions/ventures";
import { Button } from "@/components/ui/button";
import { Icons } from "@/components/ui/icons";
import { cn } from "@/lib/utils";
import { useAction } from "next-safe-action/hooks";
import { ComponentPropsWithoutRef, FC, useEffect, useState } from "react"
import { toast } from "sonner";

export interface LikeVentureButtonProps extends ComponentPropsWithoutRef<typeof Button> {
  ventureId: number;
};

export const LikeVentureButton: FC<LikeVentureButtonProps> = ({ ventureId, ...props }) => {
  const [liked, setLiked] = useState(false);


  const { execute: isLikedExecute, isExecuting: isLikedExecuting } = useAction(isVentureLiked, {
    onSuccess: ({ data }) => {
      setLiked(data?.liked ?? false);
    },
    onError: (error) => {
      toast.error("Failed to check if venture is liked");
    },
  })

  const { execute: likeExecute, isExecuting: isLikeExecuting } = useAction(likeVenture, {
    onSuccess: ({ data }) => {
      setLiked(true);
      toast.success("Venture liked");
    },
    onError: (error) => {
      toast.error("Failed to like venture");
    },
  })


  const { execute: unlikeExecute, isExecuting: isUnlikeExecuting } = useAction(unlikeVenture, {
    onSuccess: ({ data }) => {
      setLiked(false);
      toast.success("Venture unliked");
    },
    onError: (error) => {
      toast.error("Failed to unlike venture");
    },
  })

  useEffect(() => {
    isLikedExecute(ventureId);
  }, [isLikedExecute, ventureId]);

  //TODO: add better loading state
  const isLoading = isLikedExecuting || isLikeExecuting || isUnlikeExecuting;

  const handleLike = () => {
    if (isLoading) {
      return;
    }

    if (liked) {
      unlikeExecute(ventureId);
    } else {
      likeExecute(ventureId);
    }
  };

  return (
    <Button variant="ghost" size="icon" onClick={() => handleLike()} disabled={isLoading} {...props}>
      <Icons.heart className={cn(liked && "text-red-500 fill-current")} />
    </Button>
  );
};