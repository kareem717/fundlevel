import { SmallLogoIcon } from "@fundlevel/web/components/icons";
import React from "react";

export default function LoadingRoot() {
  return (
    <div className="flex h-screen w-screen items-center justify-center">
      <SmallLogoIcon className="animate-pulse size-24 text-muted-foreground/60" />
    </div>
  );
}
