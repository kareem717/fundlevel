"use client";

import { Button } from "@fundlevel/ui/components/button";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from "@fundlevel/ui/components/dropdown-menu";
import { cn } from "@fundlevel/ui/lib/utils";
import { orpc } from "@fundlevel/web/lib/orpc/client";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Download, Ellipsis, FileText, Loader2, Trash } from "lucide-react";
import type { ComponentPropsWithoutRef } from "react";
import { toast } from "sonner";

interface BankStatementItemMenuProps
	extends ComponentPropsWithoutRef<typeof Button> {
	bankStatementId: number;
	alreadyExtracted: boolean;
}

export function BankStatementItemMenu({
	bankStatementId,
	alreadyExtracted = false,
	className,
	...props
}: BankStatementItemMenuProps) {
	const queryClient = useQueryClient();
	const { mutateAsync: download, isPending: isFetchingDownloadUrl } =
		useMutation(
			orpc.bankStatement.download.mutationOptions({
				onSuccess: (data) => {
					window.open(data.downloadUrl, "_blank");
				},
			}),
		);

	const { mutateAsync: deleteFile, isPending: isDeletingFile } = useMutation(
		orpc.bankStatement.delete.mutationOptions({
			onSuccess: () => {
				toast.success("Bank statement deleted");
				queryClient.invalidateQueries({
					queryKey: orpc.bankStatement.list.queryKey(),
				});
			},
		}),
	);

	const {
		mutateAsync: extractBankStatement,
		isPending: isExtractingBankStatement,
	} = useMutation(
		orpc.bankStatement.extract.mutationOptions({
			onSuccess: () => {
				toast.success("Bank statement extraction started");
				queryClient.invalidateQueries({
					queryKey: orpc.bankStatement.list.queryKey(),
				});
			},
		}),
	);

	function handleExtractBankStatement() {
		if (alreadyExtracted) {
			toast.error("Bank statement already extracted");
			return;
		}
		extractBankStatement({ params: { id: bankStatementId } });
	}
	return (
		<DropdownMenu>
			<DropdownMenuTrigger asChild>
				<Button
					variant="ghost"
					size="icon"
					className={cn("h-8 p-0 hover:bg-muted", className)}
					{...props}
				>
					<Ellipsis className="h-4 w-4" />
				</Button>
			</DropdownMenuTrigger>
			<DropdownMenuContent
				align="end"
				onClick={(e) => e.preventDefault()} // We nest this in a link, so we need to prevent the default behavior
			>
				<DropdownMenuItem
					className="flex items-center gap-2"
					onClick={() => handleExtractBankStatement()}
					disabled={isExtractingBankStatement || alreadyExtracted}
				>
					{isExtractingBankStatement ? (
						<Loader2 className="mr-2 h-4 w-4 animate-spin" />
					) : (
						<FileText className="mr-2 h-4 w-4" />
					)}
					Extract transactions
				</DropdownMenuItem>
				<DropdownMenuItem
					className="flex items-center gap-2"
					onClick={() =>
						toast.promise(download({ params: { id: bankStatementId } }), {
							loading: "Getting download URL...",
							success: "Download URL retrieved",
							error: "Failed to get download URL",
						})
					}
					disabled={isFetchingDownloadUrl}
				>
					{isFetchingDownloadUrl ? (
						<Loader2 className="mr-2 h-4 w-4 animate-spin" />
					) : (
						<Download className="mr-2 h-4 w-4" />
					)}
					Download
				</DropdownMenuItem>
				<DropdownMenuItem
					className="flex items-center gap-2"
					onClick={() =>
						toast.promise(deleteFile({ params: { id: bankStatementId } }), {
							loading: "Deleting bank statement...",
							success: "Bank statement deleted",
							error: "Failed to delete bank statement",
						})
					}
					disabled={isDeletingFile}
				>
					{isDeletingFile ? (
						<Loader2 className="mr-2 h-4 w-4 animate-spin" />
					) : (
						<Trash className="mr-2 h-4 w-4" />
					)}
					Delete
				</DropdownMenuItem>
			</DropdownMenuContent>
		</DropdownMenu>
	);
}
