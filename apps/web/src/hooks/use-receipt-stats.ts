"use client";

import { useMemo } from "react";

// UI-specific types (matching the ones in use-receipts.ts)
interface FileUploadItem {
	id: string;
	name: string;
	size: number;
	type: string;
	status: "uploading" | "completed" | "error";
	progress: number;
	preview?: string;
	uploadedAt?: Date;
	error?: string;
}

/**
 * Hook that provides computed statistics for receipt files
 */
export const useReceiptStats = (files: FileUploadItem[]) => {
	return useMemo(() => {
		const completedCount = files.filter(
			(file) => file.status === "completed",
		).length;
		const uploadingCount = files.filter(
			(file) => file.status === "uploading",
		).length;
		const errorCount = files.filter((file) => file.status === "error").length;

		const totalSize = files.reduce((acc, file) => acc + file.size, 0);
		const averageSize = files.length > 0 ? totalSize / files.length : 0;

		// Format file size helper
		const formatFileSize = (bytes: number): string => {
			if (bytes === 0) return "0 Bytes";
			const k = 1024;
			const sizes = ["Bytes", "KB", "MB", "GB"];
			const i = Math.floor(Math.log(bytes) / Math.log(k));
			return `${Number.parseFloat((bytes / k ** i).toFixed(2))} ${sizes[i]}`;
		};

		return {
			completedCount,
			uploadingCount,
			errorCount,
			totalCount: files.length,
			totalSize: formatFileSize(totalSize),
			averageSize: formatFileSize(averageSize),
			hasErrors: errorCount > 0,
			isUploading: uploadingCount > 0,
			allCompleted: files.length > 0 && completedCount === files.length,
		};
	}, [files]);
};
