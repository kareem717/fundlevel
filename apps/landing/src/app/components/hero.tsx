import { buttonVariants } from '@repo/ui/components/button'
import { FlipWords } from '@/components/flip-words'
import { env } from '@/env'
import { cn } from '@repo/ui/lib/utils'
import { Wallet } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import { ComponentPropsWithoutRef, FC } from 'react'

export const Hero: FC<ComponentPropsWithoutRef<'section'>> = ({
  className,
  ...props
}) => {
  const showRadialGradient = true
  return (
    <section
      className={cn(
        'w-full flex flex-col items-center',
        className
      )}
      {...props}
    >
      <div className="relative w-full">
        <div className="container z-10 flex flex-col items-center justify-center w-full gap-4 px-4 pb-16 text-center sm:px-10 md:pb-24 lg:pb-32 pt-36 mx-auto">
          <h1 className="text-3xl font-medium sm:text-4xl lg:text-7xl">
            Simple Alternative Investing
            <br />
            <span className="">
              Aligned with Your{' '}
              <FlipWords words={['Values.', 'Goals.', 'Dreams.']} />
            </span>
          </h1>
          <p className="mx-auto text-sm md:text-lg md:w-2/3 text-muted-foreground">
            Fundlevel enables access to alternative and private markets,
            allowing investors to find high-return opportunities and businesses
            to raise capital in a healthy, growth-conducive manner—all while
            maintaining shariah compliance.
          </p>
          <div className="grid w-full max-w-2xl grid-cols-1 gap-4 mt-2">
            {/* <Link
              href="#"
              className={cn(
                buttonVariants({ variant: 'outline', size: 'lg' }),
                'flex flex-row items-center justify-center'
              )}
            >
              <ChartLine className="mr-2 size-4" />
              Invest
            </Link> */}
            <Link
              href={env.NEXT_PUBLIC_NEWS_LETTER_SIGN_UP_URL}
              className={cn(
                buttonVariants({ size: 'lg' }),
                'flex flex-row items-center justify-center'
              )}
            >
              <Wallet className="mr-2 size-4" />
              Get Started
            </Link>
          </div>
        </div>
        <div className="h-[35dvw] md:h-[27dvw] lg:h-[27dvw]   w-full relative mt-8 sm:mt-16 md:mt-24">
          <div className="container relative h-full mx-auto">
            <Image
              className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[90dvw] md:w-[70dvw] h-auto rounded-t-md"
              src="/assets/branding/dashboard.svg"
              alt="Pera Web"
              width={900}
              height={900}
              priority
            />
          </div>
        </div>
        <div className="absolute inset-0 pointer-events-none -z-10 touch-none">
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
    </section>
  )
}
