import { Icons } from "@/components/icons";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { ChartLine, Wallet } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { ComponentPropsWithoutRef } from "react";

const bannerItems = [
  "Secure",
  "Smart",
  "Transparent",
  "Fast",
  "Fair",
  "Inclusive",
];

export function Hero({
  className,
  ...props
}: ComponentPropsWithoutRef<"section">) {
  return (
    <section
      className={cn(
        "w-full flex flex-col items-center pt-16 overflow-x-hidden",
        className
      )}
      {...props}
    >
      <div className="container flex flex-col items-center justify-center gap-4 w-full text-center px-4 sm:px-10 mb-16 md:mb-24 lg:mb-32">
        <h1 className="text-3xl sm:text-4xl lg:text-7xl font-medium">
          Invest Smarter, Raise Faster.
          <br />
          <span className="bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
            AI-Powered, Blockchain-Secured
          </span>
        </h1>
        <p className="text-sm md:text-lg mx-auto md:w-2/3 text-muted-foreground">
          FundLevel combines blockchain security and AI intelligence to connect
          investors with innovative businesses, revolutionizing investments and
          fundraising.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-2 w-full max-w-2xl">
          <Link
            href="#"
            className={cn(
              buttonVariants({ variant: "outline", size: "lg" }),
              "flex flex-row items-center justify-center"
            )}
          >
            <ChartLine className="size-4 mr-2" />
            Explore Investments
          </Link>
          <Link
            href="#"
            className={cn(
              buttonVariants({ size: "lg" }),
              "flex flex-row items-center justify-center"
            )}
          >
            <Wallet className="size-4 mr-2" />
            Raise Funds
          </Link>
        </div>
      </div>

      <div className="h-[35dvw] md:h-[27dvw] lg:h-[27dvw] bg-[url('/assets/octagon_pattern.svg')] bg-neutral-800 w-full relative mt-8 sm:mt-16 md:mt-24">
        <div className="container h-full mx-auto relative">
          <Image
            className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[90dvw] md:w-[75dvw] h-auto"
            src="https://perawallet.s3.amazonaws.com/images/pera-web.png"
            alt="Pera Web"
            width={900}
            height={900}
            priority
          />
          <Image
            className="absolute bottom-0 left-[calc(50%+40dvw)] md:left-[calc(50%+32dvw)] w-[10dvw] h-auto" 
            src="https://perawallet.s3.amazonaws.com/images/coin.svg"
            alt="Coin Icon"
            width={100}
            height={100}
          />
        </div>
      </div>

      <div className="w-full bg-neutral-800 py-4">
        <div className="container flex flex-row items-center justify-center gap-4">
          {bannerItems.map((item, index) => (
            <div
              key={index}
              className="flex flex-row items-center justify-center"
            >
              <div className="py-1">
                <p className="text-white text-sm uppercase tracking-widest">
                  {item}
                </p>
              </div>
              <span className="inline-block w-4 h-2 bg-white/50 mx-2" />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
