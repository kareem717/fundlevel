import Link from "next/link";
import { env } from "@fundlevel/landing/env";
import { buttonVariants } from "@fundlevel/ui/components/button";

export default async function Home() {
  return (
    <main className="container mx-auto flex flex-col justify-center items-center">
      <section id="home">
        Hero
      </section>
      <div>
        <Link href={env.NEXT_PUBLIC_CALENDAR_LINK} className={buttonVariants()}>
          Talk to Founders
        </Link>
      </div>
    </main>
  );
}
