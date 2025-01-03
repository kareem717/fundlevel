"use client";

import { SmallLogoDiv } from "@/components/layout/logo-div";
import { Button, buttonVariants } from "@repo/ui/components/button";
import { meta, redirects } from "@/lib/config";
import { cn } from "@repo/ui/lib/utils";
import Link from "next/link";
import { useEffect } from "react";

export const metadata = meta.error;

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error(error);
  }, [error]);

  return (
    <div className="flex flex-col items-center gap-4 justify-center h-screen w-full p-4">
      <SmallLogoDiv />
      <h2 className="text-2xl font-semibold">
        {error.message || "Something went wrong!"}{" "}
      </h2>
      <div className="flex gap-4 w-full md:w-1/3 max-w-md min-w-[200px]">
        <Button onClick={() => reset()} className="w-full">
          Try again
        </Button>
        <Link
          href={redirects.home}
          className={cn(buttonVariants({ variant: "secondary" }), "w-full")}
        >
          Go back to home
        </Link>
      </div>
    </div>
  );
}
