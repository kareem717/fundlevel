"use client";

import type { NangoConnection, NangoProviders } from "@fundlevel/db/types";
import { Badge } from "@fundlevel/ui/components/badge";
import { Button } from "@fundlevel/ui/components/button";
import {
	Card,
	CardContent,
	CardFooter,
	CardHeader,
} from "@fundlevel/ui/components/card";
import { cn } from "@fundlevel/ui/lib/utils";
import { getIntegrationProviderMetadata } from "@fundlevel/web/lib/utils";
import { Loader2, Plus, X } from "lucide-react";
import type { ComponentPropsWithoutRef } from "react";

type ConnectedIntegrationCardProps = ComponentPropsWithoutRef<typeof Card> & {
	status: "Active" | "Error";
	integration: NangoConnection;
	onDisconnect: () => void;
	disconnecting?: boolean;
};
export function ConnectedIntegrationCard({
	integration,
	className,
	status,
	onDisconnect,
	disconnecting,
	...props
}: ConnectedIntegrationCardProps) {
	const { description, category } = getIntegrationProviderMetadata(
		integration.providerConfigKey,
	);

	return (
		<Card
			className={cn("h-full transition-shadow hover:shadow-md", className)}
			{...props}
		>
			<CardHeader className="relative flex items-center justify-between">
				<h3 className="font-semibold text-foreground">
					{integration.providerConfigKey}
				</h3>
				<Badge variant="secondary" className="mt-1 text-xs">
					{category}
				</Badge>
				<div
					className={cn(
						"-top-3.5 absolute right-2.5 size-2.5 rounded-full",
						status === "Active" ? "bg-green-500" : "bg-red-500",
						disconnecting && "animate-pulse",
					)}
				/>
			</CardHeader>
			<CardContent className="text-muted-foreground text-sm">
				{description}
			</CardContent>
			<CardFooter>
				<Button
					onClick={() => onDisconnect()}
					className="w-full"
					size="sm"
					disabled={disconnecting}
				>
					{disconnecting ? (
						<Loader2 className="size-4 animate-spin" />
					) : (
						<>
							<X className="mr-2 size-4" />
							Disconnect
						</>
					)}
				</Button>
			</CardFooter>
		</Card>
	);
}

type DisconnectedIntegrationCardProps = ComponentPropsWithoutRef<
	typeof Card
> & {
	provider: NangoProviders;
	onConnect: () => void;
	connecting?: boolean;
};

export function DisconnectedIntegrationCard({
	provider,
	onConnect,
	className,
	connecting,
	...props
}: DisconnectedIntegrationCardProps) {
	const { description, category } = getIntegrationProviderMetadata(provider);

	return (
		<Card
			className={cn("h-full transition-shadow hover:shadow-md", className)}
			{...props}
		>
			<CardHeader className="relative flex items-center justify-between">
				<h3 className="font-semibold text-foreground">{provider}</h3>
				<Badge variant="secondary" className="mt-1 text-xs">
					{category}
				</Badge>
				<div
					className={cn(
						"-top-3.5 absolute right-2.5 size-2.5 rounded-full bg-muted-foreground",
						connecting && "animate-pulse",
					)}
				/>
			</CardHeader>
			<CardContent className="text-muted-foreground text-sm">
				{description}
			</CardContent>
			<CardFooter>
				<Button
					onClick={() => onConnect()}
					className="w-full"
					size="sm"
					disabled={connecting}
				>
					{connecting ? (
						<Loader2 className="size-4 animate-spin" />
					) : (
						<>
							<Plus className="mr-2 size-4" />
							Connect
						</>
					)}
				</Button>
			</CardFooter>
		</Card>
	);
}
