"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";

type BackButtonProps = {
  className?: string;
};

export default function BackButton({ className }: BackButtonProps) {
  const router = useRouter();
  return (
    <Button
      variant="outline"
      onClick={() => router.back()}
      className={cn("w-fit", className)}

    >
      <ArrowLeft className="h-4 w-4" />
      Back
    </Button>
  );
}
