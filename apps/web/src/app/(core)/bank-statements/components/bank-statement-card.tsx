import { cn } from "@fundlevel/ui/lib/utils";
import { formatDate, getFileTypeColor } from "@fundlevel/web/lib/utils";
import { Calendar, FileText, HardDrive } from "lucide-react";

interface BankStatementCardProps {
	fileName?: string;
	uploadDate?: string;
	fileSize?: string;
	fileType?: string;
	className?: string;
}

export function BankStatementCard({
	fileName = "bank_statement_december_2024.pdf",
	uploadDate = "2024-12-15",
	fileSize = "2.4 MB",
	fileType = "PDF",
	className,
}: BankStatementCardProps) {
	return (
		<div
			className={cn(
				"-skew-y-[4deg] hover:-translate-y-2 group after:-right-1 relative flex h-48 w-80 select-none flex-col justify-between rounded-xl border-2 bg-card/90 px-6 py-4 backdrop-blur-sm transition-all duration-700 after:pointer-events-none after:absolute after:top-[-5%] after:h-[110%] after:w-[18rem] after:bg-gradient-to-l after:from-background after:to-transparent after:content-[''] hover:border-primary/30 hover:bg-card hover:shadow-lg",
				className,
			)}
		>
			{/* Header with file icon and type badge */}
			<div className="flex items-center justify-between">
				<div className="flex items-center gap-3">
					<span className="relative inline-block rounded-full bg-primary/10 p-2 transition-colors group-hover:bg-primary/20">
						<FileText className="size-5 text-primary" />
					</span>
					<span
						className={cn(
							"rounded-md border px-2 py-1 font-medium text-xs",
							getFileTypeColor(fileType),
						)}
					>
						{fileType}
					</span>
				</div>
			</div>

			{/* File name */}
			<div className="flex flex-1 items-center">
				<h3 className="line-clamp-2 font-semibold text-foreground text-lg leading-tight transition-colors group-hover:text-primary">
					{fileName}
				</h3>
			</div>

			{/* File details */}
			<div className="space-y-2">
				<div className="flex items-center gap-2 text-muted-foreground text-sm">
					<Calendar className="size-4" />
					<span>{formatDate(uploadDate)}</span>
				</div>
				<div className="flex items-center gap-2 text-muted-foreground text-sm">
					<HardDrive className="size-4" />
					<span>{fileSize}</span>
				</div>
			</div>

			{/* Hover overlay */}
			<div className="pointer-events-none absolute inset-0 rounded-xl bg-gradient-to-br from-primary/5 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
		</div>
	);
}
