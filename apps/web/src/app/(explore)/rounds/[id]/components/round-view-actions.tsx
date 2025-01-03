"use client"

import { cn } from "@repo/ui/lib/utils";
import { ComponentPropsWithoutRef, FC, useEffect, useState } from "react"
import { Button } from "@repo/ui/components/button";
import { Icons } from "@/components/icons";
import redirects from "@/lib/config/redirects";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@repo/ui/components/dropdown-menu"
import { toast } from "sonner";
import { useAction } from "next-safe-action/hooks";
import { isRoundLiked, likeRound, unlikeRound } from "@/actions/rounds";
import { useRouter } from "next/navigation";
import { Account } from "@repo/sdk";
import { getAccount } from "@/actions/auth";

export interface RoundViewActionsProps extends ComponentPropsWithoutRef<typeof DropdownMenu> {
  roundId: number;
  isLiked: boolean;
};

export const RoundViewActions: FC<RoundViewActionsProps> = ({ roundId, isLiked, ...props }) => {
  const [liked, setLiked] = useState(isLiked);
  const [account, setAccount] = useState<Account | null>(null);
  const router = useRouter();

  const { execute: isLikedExecute, isExecuting: isLikedExecuting } = useAction(isRoundLiked, {
    onSuccess: ({ data }) => {
      setLiked(data?.favourited ?? false);
    },
    onError: () => {
      toast.error("Failed to check if round is liked");
    },
  })

  const { execute: likeExecute, isExecuting: isLikeExecuting } = useAction(likeRound, {
    onSuccess: () => {
      setLiked(true);
      toast.success("Round liked");
    },
    onError: () => {
      toast.error("Failed to like round");
    },
  })

  const { execute: unlikeExecute, isExecuting: isUnlikeExecuting } = useAction(unlikeRound, {
    onSuccess: () => {
      setLiked(false);
      toast.success("Round unliked");
    },
    onError: () => {
      toast.error("Failed to unlike round");
    },
  })


  const { execute: getAccountExecute, isExecuting: isGetAccountExecuting } = useAction(getAccount, {
    onSuccess: ({ data }) => {
      setAccount(data ?? null);
    },
    onError: () => {
      toast.error("Failed to get account");
    },
  })

  useEffect(() => {
    getAccountExecute();
    isLikedExecute(roundId);
  }, [getAccountExecute, isLikedExecute, roundId]);


  //TODO: add better loading state
  const isLoading = isLikedExecuting || isLikeExecuting || isUnlikeExecuting || isGetAccountExecuting;

  const handleLike = () => {
    if (!isGetAccountExecuting && !account) {
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
    <DropdownMenu {...props}>
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