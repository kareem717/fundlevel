import { LogoIcon, SmallLogoIcon } from "@fundlevel/ui/components/custom/icons";
import { cn } from "@fundlevel/ui/lib/utils";
import { Link } from "@tanstack/react-router";
import type { ComponentPropsWithoutRef, FC } from "react";

interface LogoDivProps
	extends Omit<ComponentPropsWithoutRef<typeof Link>, "href"> {
	href?: string;
}

export const LogoDiv: FC<LogoDivProps> = ({
	className,
	href = "/",
	...props
}) => {
	return (
		<Link
			aria-label="Redirect to home"
			className={cn("w-52", className)}
			to={href}
			{...props}
		>
			<LogoIcon className="fill-foreground" />
		</Link>
	);
};

export const SmallLogoDiv: FC<LogoDivProps> = ({
	className,
	href = "/",
	...props
}) => {
	return (
		<Link
			aria-label="Redirect to home"
			className={cn(
				"flex flex-row items-center justify-center font-bold text-2xl hover:cursor-pointer",
				className,
			)}
			to={href}
			{...props}
		>
			<SmallLogoIcon className="size-9 fill-foreground" />
		</Link>
	);
};
