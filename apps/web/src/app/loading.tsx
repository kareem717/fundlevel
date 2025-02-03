import React from "react";
import { Icons } from "@/components/icons";

export default function LoadingRoot() {
  return (
    <div className="flex h-screen w-screen items-center justify-center">
      <Icons.smallLogo className="animate-pulse size-24 text-muted-foreground/60" />
    </div>
  );
}
