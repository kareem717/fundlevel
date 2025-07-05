import { NavBack } from "@web/components/nav-back";

export default function AuthLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<div className="relative flex h-screen w-full items-center justify-center bg-accent p-4">
			<NavBack className="absolute top-4 left-4" />
			{children}
		</div>
	);
}
