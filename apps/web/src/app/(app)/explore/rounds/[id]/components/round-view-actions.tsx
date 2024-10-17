"use client"

import { cn } from "@/lib/utils";
import { ComponentPropsWithoutRef, FC, useEffect, useState } from "react"
import { Button } from "@/components/ui/button";
import { Icons } from "@/components/ui/icons";
import redirects from "@/lib/config/redirects";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { toast } from "sonner";
import { useAction } from "next-safe-action/hooks";
import { isRoundLiked, likeRound, unlikeRound } from "@/actions/rounds";
import { useRouter } from "next/navigation";
export interface RoundViewActionsProps extends ComponentPropsWithoutRef<"div"> {
  roundId: number;
  isLiked: boolean;
  isLoggedIn: boolean;
};

export const RoundViewActions: FC<RoundViewActionsProps> = ({ className, roundId, isLiked, isLoggedIn, ...props }) => {
  const [liked, setLiked] = useState(isLiked);
  const router = useRouter();

  const { execute: isLikedExecute, isExecuting: isLikedExecuting } = useAction(isRoundLiked, {
    onSuccess: ({ data }) => {
      setLiked(data?.liked ?? false);
    },
    onError: (error) => {
      toast.error("Failed to check if round is liked");
    },
  })

  const { execute: likeExecute, isExecuting: isLikeExecuting } = useAction(likeRound, {
    onSuccess: ({ data }) => {
      setLiked(true);
      toast.success("Round liked");
    },
    onError: (error) => {
      toast.error("Failed to like round");
    },
  })


  const { execute: unlikeExecute, isExecuting: isUnlikeExecuting } = useAction(unlikeRound, {
    onSuccess: ({ data }) => {
      setLiked(false);
      toast.success("Round unliked");
    },
    onError: (error) => {
      toast.error("Failed to unlike round");
    },
  })

  useEffect(() => {
    isLikedExecute(roundId);
  }, [isLikedExecute, roundId]);

  //TODO: add better loading state
  const isLoading = isLikedExecuting || isLikeExecuting || isUnlikeExecuting;

  const handleLike = () => {
    if (!isLoggedIn) {
      router.push(redirects.auth.login);
      return;
    }

    if (isLoading) {
      return;
    }

    if (liked) {
      unlikeExecute(roundId);
    } else {
      likeExecute(roundId);
    }
  };

  return (
    <DropdownMenu >
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="icon" className="aspect-square">
          <Icons.ellipsis />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuLabel>Actions</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={() => {
          toast.info("Not yet implemented");
        }}>
          <Icons.upload className="mr-2 h-4 w-4 text-muted-foreground" />
          Share
        </DropdownMenuItem>
        <DropdownMenuItem disabled={isLoading} onClick={() => handleLike()}>
          <Icons.heart className={cn("mr-2 h-4 w-4 text-muted-foreground", liked && "text-red-500 fill-current")} />
          {liked ? "Unlike" : "Like"}
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => {
          toast.info("Not yet implemented");
        }}>
          <Icons.flag className="mr-2 h-4 w-4 text-muted-foreground" />
          Report
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};