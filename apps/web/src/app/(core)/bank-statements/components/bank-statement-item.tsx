import type { BankStatement } from "@fundlevel/db/types";
import { Badge } from "@fundlevel/ui/components/badge";
import {
	HoverCard,
	HoverCardContent,
	HoverCardTrigger,
} from "@fundlevel/ui/components/hover-card";
import { cn } from "@fundlevel/ui/lib/utils";
import { useRealtimeRun } from "@trigger.dev/react-hooks";
import { Calendar, File, HardDrive } from "lucide-react";
import type { ComponentPropsWithoutRef } from "react";
import { BankStatementItemMenu } from "./bank-statement-menu";

interface BankStatementItemProps extends ComponentPropsWithoutRef<"div"> {
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

	const { run, error } = useRealtimeRun(bankStatement.extractionJobId ?? "", {
		accessToken: bankStatement.extractionJobToken ?? "",
		enabled: hadExtractionJob,
	});

	return (
		<div
			className={cn(
				"group hover:-translate-y-1 relative flex transform-gpu flex-col justify-between gap-4 overflow-hidden rounded-xl border bg-background p-6 transition-all duration-300 hover:border-primary/20 hover:shadow-lg",
				className,
			)}
			{...props}
		>
			{/* File Icon and Type with Dropdown */}
			<div className="relative mb-4 flex items-start justify-between">
				<div className="flex items-center gap-3">
					<div className="flex flex-col">
						<HoverCard openDelay={250} closeDelay={100}>
							<HoverCardTrigger>
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
			</div>
			{/* File Details */}
			<div className="flex items-center justify-between">
				<div className="flex items-center gap-2 text-muted-foreground text-sm">
					<Badge
						className="flex items-center gap-2 text-sm"
						variant="secondary"
					>
						<HardDrive className="h-4 w-4" />
						{formatFileSize(bankStatement.fileSizeBytes)}
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
					<HoverCardTrigger>
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
		</div>
	);
}

const formatDate = (date: string) => {
	const dateObj = new Date(date);
	return dateObj.toLocaleDateString("en-US", {
		year: "numeric",
		month: "short",
		day: "numeric",
	});
};

const formatFileSize = (bytes: string) => {
	const bytesNum = Number(BigInt(bytes));
	if (bytesNum === 0) return "0 Bytes";

	const k = 1024;
	const sizes = ["Bytes", "KB", "MB", "GB"];
	const i = Math.floor(Math.log(bytesNum) / Math.log(k));

	return `${Number.parseFloat((bytesNum / k ** i).toFixed(2))} ${sizes[i]}`;
};

const getFileTypeDisplay = (fileType: string) => {
	const [_, subtype] = fileType.split("/");
	return subtype.toUpperCase();
};
