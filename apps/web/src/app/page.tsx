import { buttonVariants } from "@repo/ui/components/button";
import { cn } from "@repo/ui/lib/utils";
import Link from "next/link";
import React from "react";
import { ExploreNav } from "./(explore)/explore/components/layout/nav";
import Image from "next/image";

export default async function Home() {
  return (
    <div className="flex flex-col">
      <ExploreNav />
      <div className="flex flex-col space-y-6 py-6">
        <section className="max-w-6xl mx-auto space-y-12 px-4">
          {/* Hero Section */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-4 py-4 sm:py-6 md:py-8 lg:py-10">
              <h1 className="text-2xl sm:text-3xl md:text-4xl font-semibold tracking-wide">
                Discover alternate investment opportunities
              </h1>
              <p className="text-base sm:text-lg text-neutral-600">
                Discover a revolutionary approach to ethical investing through
                interest-free convertible investments. Our carefully curated
                ventures offer unique opportunities to convert your capital into
                meaningful equity stakes.
              </p>
              <div className="flex flex-row items-center gap-4">
                <Link
                  href="/explore"
                  className={cn(
                    buttonVariants({ size: "lg", variant: "outline" }),
                    "font-semibold"
                  )}
                >
                  Explore Ventures
                </Link>
                <Link
                  href="/explore"
                  className={cn(
                    buttonVariants({ size: "lg" }),
                    "font-semibold"
                  )}
                >
                  List on Fundlevel
                </Link>
              </div>
            </div>

            <div className="relative">
              <Image
                src="/hero.png"
                alt="Hero Image"
                width={500}
                height={500}
                className="object-cover h-[500px]"
              />
            </div>
          </div>

          {/* Stats Bar */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 py-12 border-t">
            <div>
              <div className="text-3xl font-bold">3M+</div>
              <div className="text-neutral-600">Global investor community</div>
            </div>
            <div>
              <div className="text-3xl font-bold">2,500+</div>
              <div className="text-neutral-600">Ventures supported</div>
            </div>
            <div>
              <div className="text-3xl font-bold">31</div>
              <div className="text-neutral-600">Unicorns in portfolio</div>
            </div>
            <div>
              <div className="text-3xl font-bold">$2.6B+</div>
              <div className="text-neutral-600">Capital raised</div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}