"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import { Heart } from "lucide-react";
import { toast } from "sonner";

export function FavouriteButton() {
  const handleClick = () => {
    toast.success("Favourited");
  };

  return (
    <Button variant="outline" size="icon" onClick={handleClick}>
      <Heart className="h-4 w-4 text-red-500" />
    </Button>
  );
}
