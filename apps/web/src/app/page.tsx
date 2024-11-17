import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import Link from "next/link";
import React from "react";
import { ExploreNav } from "./(explore)/explore/components/layout/nav";
import Image from "next/image";
import { Category, Venture } from "@/lib/dev/types";
import { VentureCard } from "./(explore)/explore/components/venture-card";
import { categories, ventures } from "@/lib/dev/config";

const getVenturesByCategory = (category: string): Venture[] => {
  return ventures
    .filter((venture) => venture.category === category)
    .slice(0, 3) as Venture[];
};

export default function Home() {
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

        <div className="flex flex-col space-y-6 py-6 max-w-6xl mx-auto">
          {categories.map((category) => (
            <VentureList key={category.label} category={category} />
          ))}
        </div>
      </div>
    </div>
  );
}

function VentureList({ category }: { category: Category }) {
  return (
    <div key={category.label} className="flex flex-col space-y-6">
      <div className="space-y-2">
        <h2 className="text-3xl font-semibold">{category.label}</h2>
        <p className="text-lg text-neutral-500">{category.description}</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {getVenturesByCategory(category.label).map((venture) => (
          <VentureCard key={venture.slug} venture={venture} />
        ))}
      </div>

      <Link
        href={category.href}
        className={cn(buttonVariants({ variant: "outline" }), "w-fit mx-auto")}
      >
        View More {category.label} Ventures
      </Link>
    </div>
  );
}
