"use client";

import { Button } from "@fundlevel/ui/components/button";
import { ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";

export function NavBack({
	className,
	onClick,
	...props
}: React.ComponentPropsWithoutRef<typeof Button>) {
	const router = useRouter();

	return (
		<Button
			variant="ghost"
			onClick={(e) => {
				router.back();
				onClick?.(e);
			}}
			className={className}
			{...props}
		>
			<ArrowLeft className="size-4" />
		</Button>
	);
}
