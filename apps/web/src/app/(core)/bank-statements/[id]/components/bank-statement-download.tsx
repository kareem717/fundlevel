"use client";

import { Button } from "@fundlevel/ui/components/button";
import { cn } from "@fundlevel/ui/lib/utils";
import { orpc } from "@fundlevel/web/lib/orpc/client";
import { useMutation } from "@tanstack/react-query";
import { Download, Loader2 } from "lucide-react";
import type { ComponentPropsWithoutRef } from "react";
import { toast } from "sonner";

interface BankStatementDownloadProps
	extends ComponentPropsWithoutRef<typeof Button> {
	bankStatementId: number;
}

export function BankStatementDownload({
	bankStatementId,
	className,
	...props
}: BankStatementDownloadProps) {
	const { mutateAsync: download, isPending: isFetchingDownloadUrl } =
		useMutation(
			orpc.bankStatement.download.mutationOptions({
				onSuccess: (data) => {
					window.open(data.downloadUrl, "_blank");
				},
			}),
		);

	return (
		<Button
			variant="outline"
			className={cn("flex items-center gap-2", className)}
			onClick={() =>
				toast.promise(download({ params: { id: bankStatementId } }), {
					loading: "Getting download URL...",
					success: "Download URL retrieved",
					error: "Failed to get download URL",
				})
			}
			disabled={isFetchingDownloadUrl}
			{...props}
		>
			{isFetchingDownloadUrl ? (
				<Loader2 className="h-4 w-4 animate-spin" />
			) : (
				<Download className="h-4 w-4" />
			)}
			Download
		</Button>
	);
}
