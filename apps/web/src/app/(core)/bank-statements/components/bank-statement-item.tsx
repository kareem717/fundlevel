import type { BankStatement } from "@fundlevel/db/types";
import { Badge } from "@fundlevel/ui/components/badge";
import {
	HoverCard,
	HoverCardContent,
	HoverCardTrigger,
} from "@fundlevel/ui/components/hover-card";
import { cn } from "@fundlevel/ui/lib/utils";
import { redirects } from "@fundlevel/web/lib/config/redirects";
import { orpc, queryClient } from "@fundlevel/web/lib/orpc/client";
import {
	formatBytes,
	formatDate,
	getFileTypeDisplay,
} from "@fundlevel/web/lib/utils";
import { useRealtimeRun } from "@trigger.dev/react-hooks";
import { Calendar, File, HardDrive } from "lucide-react";
import Link from "next/link";
import type { ComponentPropsWithoutRef } from "react";
import { BankStatementItemMenu } from "./bank-statement-menu";

interface BankStatementItemProps
	extends Omit<ComponentPropsWithoutRef<typeof Link>, "href"> {
	bankStatement: Omit<
		BankStatement,
		"fileSizeBytes" | "createdAt" | "updatedAt"
	> & {
		fileSizeBytes: string;
		createdAt: string;
		updatedAt: string;
	};
}

export function BankStatementItem({
	bankStatement,
	className,
	...props
}: BankStatementItemProps) {
	const hadExtractionJob =
		!!bankStatement.extractionJobId && !!bankStatement.extractionJobToken;

	//TODO: handle query
	const { run } = useRealtimeRun(bankStatement.extractionJobId ?? "", {
		accessToken: bankStatement.extractionJobToken ?? "",
		enabled: hadExtractionJob,
		onComplete: () => {
			//invalidate the transactions query
			queryClient.invalidateQueries({
				queryKey: orpc.bankStatement.transactions.queryKey({
					input: { params: { id: bankStatement.id } },
				}),
			});
		},
	});

	return (
		<Link
			{...props}
			href={redirects.app.bankStatements.view(bankStatement.id)}
			className={cn(
				"group hover:-translate-y-1 relative flex transform-gpu flex-col justify-between gap-4 overflow-hidden rounded-xl border bg-background p-6 transition-all duration-300 hover:border-primary/20 hover:shadow-lg",
				className,
			)}
		>
			{/* File Icon and Type with Dropdown */}
			{/* <div className="relative mb-4 flex items-start justify-between"> */}
			<div className="relative flex items-center gap-3">
				<div className="flex flex-col">
					<HoverCard openDelay={250} closeDelay={100}>
						<HoverCardTrigger asChild>
							<h3 className="max-w-[220px] cursor-default truncate font-semibold text-foreground">
								{bankStatement.originalFileName}
							</h3>
						</HoverCardTrigger>
						<HoverCardContent className="max-w-xs">
							{bankStatement.originalFileName}
						</HoverCardContent>
					</HoverCard>
					<div className="flex items-center gap-2 text-muted-foreground text-sm">
						<Calendar className="h-4 w-4" />
						<span>{formatDate(bankStatement.createdAt)}</span>
					</div>
				</div>
				<BankStatementItemMenu
					bankStatementId={bankStatement.id}
					alreadyExtracted={["COMPLETED", "QUEUED", "DELAYED"].includes(
						run?.status ?? "",
					)}
					className="-top-4 -right-4 absolute"
				/>
			</div>
			{/* </div> */}
			{/* File Details */}
			<div className="flex items-center justify-between">
				<div className="flex items-center gap-2 text-muted-foreground text-sm">
					<Badge
						className="flex items-center gap-2 text-sm"
						variant="secondary"
					>
						<HardDrive className="h-4 w-4" />
						{formatBytes(bankStatement.fileSizeBytes)}
					</Badge>
					<Badge
						className="flex items-center gap-2 text-sm"
						variant="secondary"
					>
						<File className="h-4 w-4" />
						{getFileTypeDisplay(bankStatement.fileType)}
					</Badge>
				</div>
				<HoverCard>
					<HoverCardTrigger asChild>
						{run?.status ? (
							<Badge>{run.status}</Badge>
						) : (
							<Badge variant="outline">Unprocessed</Badge>
						)}
					</HoverCardTrigger>
					<HoverCardContent>
						<p>
							The status of the transaction extraction job is:{" "}
							{run?.status ?? "Unprocessed"}
						</p>
					</HoverCardContent>
				</HoverCard>
			</div>
			{/* Hover overlay */}
			<div className="pointer-events-none absolute inset-0 transform-gpu transition-all duration-300 group-hover:bg-primary/[0.02]" />
		</Link>
	);
}
