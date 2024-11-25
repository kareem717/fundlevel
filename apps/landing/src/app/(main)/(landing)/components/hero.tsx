import { Icons } from '@/components/icons';
import { buttonVariants } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import Image from 'next/image';
import Link from 'next/link';
import { FC, ComponentPropsWithoutRef } from 'react';

export interface HeroProps extends ComponentPropsWithoutRef<'section'> { }

export const Hero: FC<HeroProps> = ({ className, ...props }) => {
    return (
        <section className={cn("flex flex-col items-center justify-between gap-96", className)} {...props}>
            <div className="container flex flex-col items-center justify-center gap-4 [&>*]:text-center w-full px-10">
                <h1 className="text-4xl md:text-7xl font-medium">
                    Simply the best Algorand wallet
                </h1>
                <p className="text-sm md:text-lg mx-auto md:w-2/3 text-muted-foreground">
                    Pera Wallet is the easiest and safest way to store, buy and swap on the Algorand
                    blockchain. Discover & connect decentralized applications (dApps) on any device.
                </p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-2 w-full md:w-[45%] mx-auto">
                    <Link href="#" className={buttonVariants({ variant: "outline", size: "lg" })}>
                        <Icons.moon className="size-4 mr-2" />
                        Launch Fundlevel Web
                    </Link>
                    <Link href="#" className={buttonVariants({ size: "lg" })}>
                        <Icons.moon className="size-4 mr-2" />
                        Download Fundlevel Mobile
                    </Link>
                </div>
            </div>
            <div className="h-72 bg-[url('/assets/octagon_pattern.svg')] bg-primary w-full">
                <div className="container relative h-full mx-auto">
                    <Image
                        className="absolute bottom-0 left-[10%] w-[897px] h-auto hidden xl:block"
                        src="https://perawallet.s3.amazonaws.com/images/pera-web.png"
                        alt="Pera Web"
                        width={900}
                        height={900}
                    />
                    <Image
                        className="absolute bottom-0 right-[28%] z-10 hidden xl:block"
                        src="https://perawallet.s3.amazonaws.com/images/coin.svg"
                        alt="Coin Icon"
                        width={100}
                        height={100}
                    />
                    <Image
                        className="absolute bottom-0 left-[calc(50%-156px)] right-[calc(50%-156px)] xl:left-[calc(10%+897px)] w-[312px] h-auto"
                        src="https://perawallet.s3.amazonaws.com/images/pera-mobile.png"
                        alt="Pera Mobile"
                        width={312}
                        height={600}
                    />
                </div>
            </div>
        </section>
    );
};
