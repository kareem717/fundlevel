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
import { isVentureLiked, likeVenture, unlikeVenture } from "@/actions/ventures";
import { useRouter } from "next/navigation";
import { Account } from "@/lib/api";
import { getAccount } from "@/actions/auth";

export interface VentureViewActionsProps extends ComponentPropsWithoutRef<typeof DropdownMenu> {
  ventureId: number;
};

export const VentureViewActions: FC<VentureViewActionsProps> = ({ ventureId, ...props }) => {
  const [liked, setLiked] = useState<boolean | undefined>(false);
  const [account, setAccount] = useState<Account | undefined>(undefined);

  const router = useRouter();

  const { execute: isLikedExecute, isExecuting: isLikedExecuting } = useAction(isVentureLiked, {
    onSuccess: ({ data }) => {
      setLiked(data?.liked ?? false);
    },
    onError: (error) => {
      toast.error("Failed to check if round is liked");
    },
  })

  const { execute: likeExecute, isExecuting: isLikeExecuting } = useAction(likeVenture, {
    onSuccess: ({ data }) => {
      setLiked(true);
      toast.success("Round liked");
    },
    onError: (error) => {
      toast.error("Failed to like round");
    },
  })

  const { execute: unlikeExecute, isExecuting: isUnlikeExecuting } = useAction(unlikeVenture, {
    onSuccess: ({ data }) => {
      setLiked(false);
      toast.success("Round unliked");
    },
    onError: (error) => {
      toast.error("Failed to unlike round");
    },
  })

  const { execute: getAccountExecute, isExecuting: isGetAccountExecuting } = useAction(getAccount, {
    onSuccess: ({ data }) => {
      setAccount(data);
    },
    onError: (error) => {
      toast.error("Failed to get account");
    },
  })

  useEffect(() => {
    getAccountExecute();
    isLikedExecute(ventureId);
  }, []);


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
      unlikeExecute(ventureId);
    } else {
      likeExecute(ventureId);
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
          {liked === undefined ? "Loading..." : liked ? "Unlike" : "Like"}
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