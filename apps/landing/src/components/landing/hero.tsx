import { Icons } from "@/components/icons";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { ChartLine, Wallet } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { ComponentPropsWithoutRef } from "react";
import { AuroraBackground } from "../ui/aurora";

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
  const showRadialGradient = true;
  return (
    <section
      className={cn(
        "w-full flex flex-col items-center overflow-x-hidden",
        className
      )}
      {...props}
    >
      <div className="relative w-full">
        <div className="container z-10 flex flex-col items-center justify-center gap-4 w-full text-center px-4 sm:px-10 pb-16 md:pb-24 lg:pb-32 pt-36">
          <h1 className="text-3xl sm:text-4xl lg:text-7xl font-medium">
            Invest Smarter, Raise Faster.
            <br />
            <span className="bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
              AI-Powered, Blockchain-Secured
            </span>
          </h1>
          <p className="text-sm md:text-lg mx-auto md:w-2/3 text-muted-foreground">
            FundLevel combines blockchain security and AI intelligence to
            connect investors with innovative businesses, revolutionizing
            investments and fundraising.
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

        <div className="h-[35dvw] md:h-[27dvw] lg:h-[27dvw]   w-full relative mt-8 sm:mt-16 md:mt-24">
          <div className="container h-full mx-auto relative">
            <Image
              className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[90dvw] md:w-[70dvw] h-auto"
              src="https://perawallet.s3.amazonaws.com/images/pera-web.png"
              alt="Pera Web"
              width={900}
              height={900}
              priority
            />
            <Image
              className="absolute bottom-0 left-[calc(50%+40dvw)] md:left-[calc(50%+32dvw)] w-[8dvw] h-auto [animation:spinY_2s_linear_infinite] [transform-style:preserve-3d]"
              src="https://perawallet.s3.amazonaws.com/images/coin.svg"
              alt="Coin Icon"
              width={100}
              height={100}
            />
          </div>
        </div>

        <div className="absolute inset-0 -z-10 pointer-events-none touch-none">
          <div
            className={cn(
              `
            [--white-gradient:repeating-linear-gradient(100deg,var(--white)_0%,var(--white)_7%,var(--transparent)_10%,var(--transparent)_12%,var(--white)_16%)]
            [--dark-gradient:repeating-linear-gradient(100deg,var(--black)_0%,var(--black)_7%,var(--transparent)_10%,var(--transparent)_12%,var(--black)_16%)]
            [--aurora:repeating-linear-gradient(100deg,var(--blue-500)_10%,var(--indigo-300)_15%,var(--blue-300)_20%,var(--violet-200)_25%,var(--blue-400)_30%)]
            [background-image:var(--white-gradient),var(--aurora)]
            dark:[background-image:var(--dark-gradient),var(--aurora)]
            [background-size:300%,_200%]
            [background-position:50%_50%,50%_50%]
            filter blur-[10px] invert dark:invert-0
            after:content-[""] after:absolute after:inset-0 after:[background-image:var(--white-gradient),var(--aurora)] 
            after:dark:[background-image:var(--dark-gradient),var(--aurora)]
            after:[background-size:200%,_100%] 
            after:animate-aurora after:[background-attachment:fixed] after:mix-blend-difference
            pointer-events-none
            absolute -inset-[10px] opacity-80 dark:opacity-30 will-change-transform`,
              showRadialGradient &&
                `[mask-image:radial-gradient(ellipse_at_100%_0%,black_5%,var(--transparent)_75%)]`
            )}
          />
        </div>
      </div>

      <div className="w-full bg-neutral-800 py-4 overflow-hidden">
        <div className="animate-marquee whitespace-nowrap">
          <div className="inline-flex gap-4">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="flex">
                {bannerItems.map((item, index) => (
                  <div
                    key={`${i}-${index}`}
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
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
