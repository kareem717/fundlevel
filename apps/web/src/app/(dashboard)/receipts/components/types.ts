// UI-specific types for receipts (not database types)

export interface FileUploadItem {
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

export type ViewMode = "list" | "grid";
export type SortBy = "date" | "merchant" | "amount";
export type SortOrder = "asc" | "desc";
