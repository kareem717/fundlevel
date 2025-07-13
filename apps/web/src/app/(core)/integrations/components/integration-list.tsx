"use client";

import { nangoProviders } from "@fundlevel/db/schema/integration";
import { Badge } from "@fundlevel/ui/components/badge";
import { Button } from "@fundlevel/ui/components/button";
import { Skeleton } from "@fundlevel/ui/components/skeleton";
import { cn } from "@fundlevel/ui/lib/utils";
import { useIntegrationConnect } from "@fundlevel/web/hooks/use-integration-connect";
import { orpc, queryClient } from "@fundlevel/web/lib/orpc/client";
import { ORPCError } from "@orpc/client";
import { useMutation, useQuery } from "@tanstack/react-query";
import { Database, FileText, Link, Settings } from "lucide-react";
import { nanoid } from "nanoid";
import React, { type ComponentPropsWithoutRef } from "react";
import { toast } from "sonner";
import {
	ConnectedIntegrationCard,
	DisconnectedIntegrationCard,
} from "./integration-card";

// Empty State component
interface EmptyStateProps {
	title: string;
	description: string;
	icons?: React.ComponentType<{ className?: string }>[];
	action?: {
		label: string;
		onClick: () => void;
	};
	className?: string;
}

function EmptyState({
	title,
	description,
	icons = [],
	action,
	className,
}: EmptyStateProps) {
	return (
		<div
			className={cn(
				"border-border bg-background text-center hover:border-border/80",
				"mx-auto w-full rounded-xl border-2 border-dashed p-14",
				"group transition duration-500 hover:bg-muted/50 hover:duration-200",
				className,
			)}
		>
			<div className="isolate flex justify-center">
				{icons.length >= 3 ? (
					<>
						<div className="-rotate-6 group-hover:-translate-x-5 group-hover:-rotate-12 group-hover:-translate-y-0.5 relative top-1.5 left-2.5 grid size-12 place-items-center rounded-xl bg-background shadow-lg ring-1 ring-border transition duration-500 group-hover:duration-200">
							{React.createElement(icons[0], {
								className: "w-6 h-6 text-muted-foreground",
							})}
						</div>
						<div className="group-hover:-translate-y-0.5 relative z-10 grid size-12 place-items-center rounded-xl bg-background shadow-lg ring-1 ring-border transition duration-500 group-hover:duration-200">
							{React.createElement(icons[1], {
								className: "w-6 h-6 text-muted-foreground",
							})}
						</div>
						<div className="group-hover:-translate-y-0.5 relative top-1.5 right-2.5 grid size-12 rotate-6 place-items-center rounded-xl bg-background shadow-lg ring-1 ring-border transition duration-500 group-hover:translate-x-5 group-hover:rotate-12 group-hover:duration-200">
							{React.createElement(icons[2], {
								className: "w-6 h-6 text-muted-foreground",
							})}
						</div>
					</>
				) : icons.length > 0 ? (
					<div className="group-hover:-translate-y-0.5 grid size-12 place-items-center rounded-xl bg-background shadow-lg ring-1 ring-border transition duration-500 group-hover:duration-200">
						{React.createElement(icons[0], {
							className: "w-6 h-6 text-muted-foreground",
						})}
					</div>
				) : null}
			</div>
			<h2 className="mt-6 font-medium text-foreground">{title}</h2>
			<p className="mt-1 whitespace-pre-line text-muted-foreground text-sm">
				{description}
			</p>
			{action && (
				<Button
					onClick={action.onClick}
					variant="outline"
					className="mt-4 shadow-sm active:shadow-none"
				>
					{action.label}
				</Button>
			)}
		</div>
	);
}

interface IntegrationListProps extends ComponentPropsWithoutRef<"div"> {}

export function IntegrationList({ className, ...props }: IntegrationListProps) {
	const { data, isPending, isError, refetch } = useQuery(
		orpc.integration.getAll.queryOptions({
			refetchOnMount: false,
			refetchOnWindowFocus: false,
			retry: (failureCount, error) => {
				if (error instanceof ORPCError) {
					return false;
				}

				return failureCount <= 1;
			},
		}),
	);

	const { mutate: disconnect, isPending: isDisconnecting } = useMutation(
		orpc.integration.disconnect.mutationOptions({
			onError: (error) => {
				toast.error("Failed to disconnect", {
					description: error.message,
				});
			},
			onSuccess: () => {
				toast.success("Success", {
					description: "Your integration has been disconnected",
				});
				queryClient.invalidateQueries({
					queryKey: orpc.integration.getAll.key(),
				});
			},
		}),
	);

	const { mutate: connect, isPending: isConnecting } = useIntegrationConnect({
		onConnect: () => {
			queryClient.invalidateQueries({
				queryKey: orpc.integration.getAll.key(),
			});
		},
		onClose: () => {
			queryClient.invalidateQueries({
				queryKey: orpc.integration.getAll.key(),
			});
		},
	});

	if (isPending) {
		return (
			<section className={cn("space-y-6", className)} {...props}>
				<div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
					{Array.from({ length: 3 }).map((_, i) => (
						<Skeleton key={nanoid()} className="h-48 w-full" />
					))}
				</div>
			</section>
		);
	}

	if (isError) {
		return (
			<section className={cn("space-y-6", className)} {...props}>
				<div className="flex justify-center py-12">
					<EmptyState
						title="Error Loading Integrations"
						description="There was an error loading your integrations. Please try again."
						icons={[Settings]}
						action={{
							label: "Retry",
							onClick: () => refetch(),
						}}
					/>
				</div>
			</section>
		);
	}

	const availableIntegrations = nangoProviders.enumValues.filter(
		(provider) =>
			!data.connections.some(
				(connection) => connection.providerConfigKey === provider,
			),
	);

	return (
		<div className={cn("space-y-20", className)} {...props}>
			<section>
				{/* Connected Integrations */}
				{data.connections.length > 0 ? (
					<div className="space-y-4">
						<div className="flex items-center justify-start gap-2">
							<Badge variant="secondary">{data.connections.length}</Badge>
							<h2 className="flex-1 font-semibold text-foreground text-xl">
								Connected Integrations
							</h2>
						</div>
						<div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
							{data.connections.map((integration) => (
								<ConnectedIntegrationCard
									key={integration.id}
									integration={integration}
									onDisconnect={() =>
										disconnect({ connectionId: integration.id })
									}
									status={"Active"}
									disconnecting={isDisconnecting}
								/>
							))}
						</div>
					</div>
				) : (
					<div className="flex justify-center py-12">
						<EmptyState
							title="No Integrations Connected"
							className="mx-auto w-full"
							description="Sync your data and streamline your workflow, connect your first integration to get started."
							icons={[Database, FileText, Link]}
							// action={{
							//   label: "Browse Available Integrations",
							//   onClick: () => {
							//     // Scroll to the connect buttons section
							//     const connectSection = document.querySelector('[data-connect-section]');
							//     connectSection?.scrollIntoView({ behavior: 'smooth' });
							//   }
							// }}
						/>
					</div>
				)}
			</section>
			{availableIntegrations.length > 0 && (
				<section data-connect-section>
					<div className="space-y-4">
						<div className="flex items-center justify-start gap-2">
							<Badge variant="secondary">{availableIntegrations.length}</Badge>
							<h2 className="flex-1 font-semibold text-foreground text-xl">
								Available Integrations
							</h2>
						</div>
						<div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
							{availableIntegrations.map((provider) => (
								<DisconnectedIntegrationCard
									key={provider}
									provider={provider}
									onConnect={() => connect({ integration: provider })}
									connecting={isConnecting}
								/>
							))}
						</div>
					</div>
				</section>
			)}
		</div>
	);
}
