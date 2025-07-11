"use client";

import { Button } from "@fundlevel/ui/components/button";
import { AnimatePresence } from "framer-motion";
import { Grid, List, RefreshCw } from "lucide-react";
import React, { type ComponentPropsWithoutRef } from "react";
import type { FileUploadItem, ViewMode } from "./types";
import { UploadFileItem } from "./upload-file-item";

interface RecentUploadsListProps extends ComponentPropsWithoutRef<"div"> {
	files: FileUploadItem[];
	viewMode: ViewMode;
	onViewModeChange: (mode: ViewMode) => void;
	onRemoveFile: (id: string) => void;
}

export function RecentUploadsList({
	className,
	files,
	viewMode,
	onViewModeChange,
	onRemoveFile,
	...props
}: RecentUploadsListProps) {
	const completedFiles = files.filter((file) => file.status === "completed");
	const uploadingFiles = files.filter((file) => file.status === "uploading");

	if (files.length === 0) {
		return null;
	}

	return (
		<div
			className={`overflow-hidden rounded-xl border bg-card ${className || ""}`}
			{...props}
		>
			<div className="border-b px-6 py-4">
				<div className="flex items-center justify-between">
					<div className="flex items-center space-x-4">
						<h3 className="font-semibold text-lg">
							Recent Uploads ({files.length})
						</h3>
						{uploadingFiles.length > 0 && (
							<span className="inline-flex items-center gap-2 rounded-full bg-blue-100 px-2 py-1 text-blue-800 text-xs dark:bg-blue-900/20 dark:text-blue-400">
								<RefreshCw className="mr-1 h-3 w-3 animate-spin" />
								{uploadingFiles.length} processing
							</span>
						)}
					</div>
					<div className="flex items-center space-x-2">
						<div className="flex items-center space-x-1 rounded-lg bg-muted p-1">
							<Button
								onClick={() => onViewModeChange("list")}
								className={`rounded p-1 ${
									viewMode === "list" ? "bg-background shadow-sm" : ""
								}`}
							>
								<List className="h-4 w-4" />
							</Button>
							<Button
								onClick={() => onViewModeChange("grid")}
								className={`rounded p-1 ${
									viewMode === "grid" ? "bg-background shadow-sm" : ""
								}`}
							>
								<Grid className="h-4 w-4" />
							</Button>
						</div>
					</div>
				</div>
			</div>

			<div className="divide-y">
				<AnimatePresence>
					{files.map((file) => (
						<UploadFileItem key={file.id} file={file} onRemove={onRemoveFile} />
					))}
				</AnimatePresence>
			</div>
		</div>
	);
}
