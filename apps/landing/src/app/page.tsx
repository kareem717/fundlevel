import Link from "next/link";
import { env } from "@fundlevel/landing/env";
import { buttonVariants } from "@fundlevel/ui/components/button";
import { LogoDiv } from "../components/logo-div";
import { socials } from "@fundlevel/landing/lib/config"
import { ModeToggle } from "../components/mode-toggle";
import { copy } from "@fundlevel/landing/lib/config"

export default async function Home() {
  return (
    <main className="px-4 py-2 h-screen flex flex-col justify-between">
      <header className="py-2 flex justify-between items-center">
        <div className="w-40">
          <LogoDiv />
        </div>
        <ModeToggle />
      </header>
      <section id="home" className="flex flex-col justify-center items-center gap-8">
        <div className="flex gap-4 flex-col">
          <h1 className="text-5xl md:text-7xl max-w-2xl tracking-tighter text-center font-regular">
            {copy.hero.main}
          </h1>
          <p className="text-sm md:text-xl leading-relaxed tracking-tight text-muted-foreground max-w-2xl text-center">
            {copy.hero.subheading}
          </p>
        </div>
        <div className="grid grid-cols-2 gap-2 max-w-md mx-auto">
          <Link href={env.NEXT_PUBLIC_CALENDAR_LINK} className={buttonVariants()} aria-label="Founder's calendar link">
            Talk to Founders
          </Link>
          <Link href={env.NEXT_PUBLIC_WEB_URL} className={buttonVariants({ variant: "secondary" })} aria-label="Application link">
            Get Started
          </Link>
        </div>
      </section>
      <footer className="flex justify-between">
        <span className="text-xs text-muted-foreground">
          {`© ${new Date().getFullYear()} Fundlevel. All rights reserved.`}
        </span>
        <div className="flex gap-4">
          {socials.map(({ icon: Icon, label, link }) => (
            <Link key={link} href={link} aria-label={`Link to Fundlevel's ${label} profile`} >
              <Icon className="size-5" />
            </Link>
          ))}
        </div>
      </footer>
    </main>
  );
}
