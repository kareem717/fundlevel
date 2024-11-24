import { Icons } from '@/components/icons';
import { buttonVariants } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import Link from 'next/link';
import { FC, ComponentPropsWithoutRef } from 'react';

export interface HeroProps extends ComponentPropsWithoutRef<'section'> { }

export const Hero: FC<HeroProps> = ({ className, ...props }) => {
    return (
        <section className={className} {...props}>
            <div className="container flex flex-col items-center justify-center gap-4 [&>*]:text-center">
                <h1 className="text-7xl font-medium">
                    Simply the best Algorand wallet
                </h1>
                <p className="text-lg mx-auto w-2/3 text-muted-foreground">
                    Pera Wallet is the easiest and safest way to store, buy and swap on the Algorand
                    blockchain. Discover & connect decentralized applications (dApps) on any device.
                </p>
                <div className="grid grid-cols-2 gap-4 mt-2 w-[45%] mx-auto">
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
        </section>
    );
};
