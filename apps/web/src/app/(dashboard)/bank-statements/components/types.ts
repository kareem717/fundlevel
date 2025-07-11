// UI-specific types for bank statements page
export interface FileUploadItem {
	id: string;
	name: string;
	size: number;
	type: string;
	status: "uploading" | "completed" | "error";
	progress: number;
	uploadedAt?: Date;
	preview?: string;
	error?: string;
}

export type ViewMode = "grid" | "list";
export type SortBy = "name" | "date" | "size";
export type SortOrder = "asc" | "desc";
