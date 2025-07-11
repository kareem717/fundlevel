"use client";

import { useMemo } from "react";
import type { FileUploadItem } from "@/app/(dashboard)/bank-statements/components/types";

/**
 * Hook to compute file statistics from files array
 */
export const useFileStats = (files: FileUploadItem[]) => {
	const stats = useMemo(() => {
		const completedFiles = files.filter((file) => file.status === "completed");
		const uploadingFiles = files.filter((file) => file.status === "uploading");
		const errorFiles = files.filter((file) => file.status === "error");

		return {
			completedFiles,
			uploadingFiles,
			errorFiles,
			totalFiles: files.length,
			completedCount: completedFiles.length,
			uploadingCount: uploadingFiles.length,
			errorCount: errorFiles.length,
		};
	}, [files]);

	return stats;
};
