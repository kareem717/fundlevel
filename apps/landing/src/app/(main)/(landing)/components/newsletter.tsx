"use client";

import React from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Mail } from "lucide-react";
import { BackgroundBeams } from "@/components/ui/background-beams";

export default function Newsletter() {
  return (
    <section className="w-full p-12">
      <div className="container px-4 md:px-6">
        <div className="px-6 py-28 bg-black rounded-xl antialiased relative shadow-xl">
          <div className="grid gap-8 lg:grid-cols-2 items-start">
            <div className="flex flex-col md:flex-row items-start gap-4">
              <div className="bg-white/10 w-14 h-14 rounded-2xl flex items-center justify-center flex-shrink-0">
                <Mail className="w-8 h-8 text-white" />
              </div>
              <div className="flex flex-col gap-2 items-start">
                <h2 className="text-3xl md:text-4xl bg-clip-text text-transparent bg-gradient-to-b from-neutral-200 to-neutral-500  text-left font-sans font-bold">
                  Keep up with the latest
                </h2>
                <p className="text-gray-300">
                  Subscribe to our newsletter to get the latest Fundlevel news.
                </p>
              </div>
            </div>
            <div className="space-y-3">
              <h3 className="text-sm font-medium text-gray-300 hidden lg:block">
                Subscribe to our newsletter
              </h3>
              <div className="flex flex-col sm:flex-row gap-3">
                <Input
                  type="email"
                  placeholder="Enter your email"
                  className="bg-zinc-900 border-zinc-800 text-white placeholder:text-gray-400"
                />
                <Button className="bg-indigo-600 hover:bg-indigo-700 text-white px-8">
                  Subscribe
                </Button>
              </div>
            </div>
          </div>
          <BackgroundBeams className="pointer-events-none touch-none" />
        </div>
      </div>
    </section>
  );
}
