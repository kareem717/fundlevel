"use client";

import React from "react";
import { Button } from "@repo/ui/components/button";
import { ThumbsDown } from "lucide-react";
import { toast } from "sonner";

export function DislikeButton() {

  const handleClick = () => {
    toast.success("Disliked");
  };

  return (
    <Button variant="outline" size="icon" onClick={handleClick}>
      <ThumbsDown className="h-4 w-4 text-red-950" />
    </Button>
  );
}
