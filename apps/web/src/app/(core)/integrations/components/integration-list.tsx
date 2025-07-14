"use client";

import { nangoProviders } from "@fundlevel/db/schema/integration";
import { Badge } from "@fundlevel/ui/components/badge";
import { Skeleton } from "@fundlevel/ui/components/skeleton";
import { cn } from "@fundlevel/ui/lib/utils";
import { EmptyListState } from "@fundlevel/web/components/empty-list-state";
import { useIntegrationConnect } from "@fundlevel/web/hooks/use-integration-connect";
import { orpc } from "@fundlevel/web/lib/orpc/client";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Database, FileText, Link, Settings } from "lucide-react";
import { nanoid } from "nanoid";
import type { ComponentPropsWithoutRef } from "react";
import { toast } from "sonner";
import {
	ConnectedIntegrationCard,
	DisconnectedIntegrationCard,
} from "./integration-card";

interface IntegrationListProps extends ComponentPropsWithoutRef<"div"> {}

export function IntegrationList({ className, ...props }: IntegrationListProps) {
	const queryClient = useQueryClient();
	const { data, isPending, isError, refetch } = useQuery(
		orpc.integration.getAll.queryOptions(),
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
					{Array.from({ length: 3 }).map((_, _i) => (
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
					<EmptyListState
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
						<EmptyListState
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
