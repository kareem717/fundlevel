"use client";

import { Button } from "@repo/ui/components/button";
import { cn } from "@/lib/utils";
import { useQueryState } from "nuqs";

const tabTriggerStyles =
  "inline-flex items-center bg-muted justify-center whitespace-nowrap rounded-sm px-3 py-1.5 my-2 text-sm font-medium ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50";

export function VentureTabs() {
  const [tab, setTab] = useQueryState("tab", {
    defaultValue: "overview",
  });

  return (
    <div className="overflow-x-auto">
      <div className="inline-flex items-center justify-start rounded-md bg-muted h-10 px-1 text-muted-foreground gap-1 min-w-fit">
        <button
          className={cn(
            tabTriggerStyles,
            tab === "overview" ? "text-foreground shadow-sm bg-background" : ""
          )}
          onClick={() => setTab("overview")}
        >
          Overview
        </button>
        <button
          className={cn(
            tabTriggerStyles,
            tab === "pitch" ? "text-foreground shadow-sm bg-background" : ""
          )}
          onClick={() => setTab("pitch")}
        >
          Pitch
        </button>
        <button
          className={cn(
            tabTriggerStyles,
            tab === "team" ? "text-foreground shadow-sm bg-background" : ""
          )}
          onClick={() => setTab("team")}
        >
          Team
        </button>
        <button
          className={cn(
            tabTriggerStyles,
            tab === "documents" ? "text-foreground shadow-sm bg-background" : ""
          )}
          onClick={() => setTab("documents")}
        >
          Documents
        </button>
        <button
          className={cn(
            tabTriggerStyles,
            tab === "faq" ? "text-foreground shadow-sm bg-background" : ""
          )}
          onClick={() => setTab("faq")}
        >
          FAQ
        </button>
      </div>
    </div>
  );
}
