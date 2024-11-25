import { business, contact, copy } from "@/lib/config";
import { Hero } from "@/app/(main)/(landing)/components/hero";
import Newsletter from "@/app/(main)/(landing)/components/newsletter";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { buttonVariants } from "@/components/ui/button";
import { Icons } from "@/components/icons";
import { createElement } from "react";
import { Features } from "@/app/(main)/(landing)/components/features";

export default async function Home() {
  const {
    landing: { hero },
  } = copy;

  return (
    <div className="flex flex-col w-full items-center relative gap-4">
      <Hero id="hero" />
      <Features />
      <Newsletter />
    </div>
  );
}
