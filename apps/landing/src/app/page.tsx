import { copy } from "@fundlevel/landing/lib/config/copy";
import { socials } from "@fundlevel/landing/lib/config/socials";
import { FundlevelLogo } from "@fundlevel/ui/components/custom/icons";
import Link from "next/link";

export default async function HomePage() {
	return (
		<main className="flex h-screen flex-col justify-between px-4 py-2">
			<header className="flex items-center justify-between py-2">
				<FundlevelLogo className="w-40" />
			</header>
			<section
				id="home"
				className="flex flex-col items-center justify-center gap-8"
			>
				<div className="flex flex-col gap-4">
					<h1 className="max-w-2xl text-center font-regular text-5xl tracking-tighter md:text-7xl">
						{copy.hero.main}
					</h1>
					<p className="max-w-2xl text-center text-muted-foreground text-sm leading-relaxed tracking-tight md:text-xl">
						{copy.hero.subheading}
					</p>
				</div>
			</section>
			<footer className="flex justify-between">
				<span className="text-muted-foreground text-xs">
					{`© ${new Date().getFullYear()} Fundlevel. All rights reserved.`}
				</span>
				<div className="flex gap-4">
					{socials.map(({ icon: Icon, label, link }) => (
						<Link
							key={link}
							href={link}
							aria-label={`Link to Fundlevel's ${label} profile`}
						>
							<Icon className="size-5" />
						</Link>
					))}
				</div>
			</footer>
		</main>
	);
}
