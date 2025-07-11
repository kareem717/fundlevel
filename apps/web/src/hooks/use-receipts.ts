"use client";

import { create } from "zustand";
import { devtools } from "zustand/middleware";

// UI-specific types (will be defined in components/types.ts)
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

type ViewMode = "list" | "grid";
type SortBy = "date" | "merchant" | "amount";
type SortOrder = "asc" | "desc";

interface ReceiptsUIState {
	// UI State only
	files: FileUploadItem[];
	expandedReceipts: Set<number>;
	extractingReceipts: Set<number>;
	exportingReceipts: Set<number>;
	viewMode: ViewMode;
	sortBy: SortBy;
	sortOrder: SortOrder;

	// UI Actions
	setFiles: (files: FileUploadItem[]) => void;
	addFiles: (files: FileUploadItem[]) => void;
	updateFile: (id: string, updates: Partial<FileUploadItem>) => void;
	removeFile: (id: string) => void;
	clearFiles: () => void;

	toggleExpansion: (receiptId: number) => void;
	setExtracting: (receiptId: number, extracting: boolean) => void;
	setExporting: (receiptId: number, exporting: boolean) => void;

	setViewMode: (mode: ViewMode) => void;
	setSortBy: (sortBy: SortBy) => void;
	setSortOrder: (order: SortOrder) => void;
}

export const useReceiptsUIStore = create<ReceiptsUIState>()(
	devtools(
		(set, _get) => ({
			// Initial state
			files: [],
			expandedReceipts: new Set(),
			extractingReceipts: new Set(),
			exportingReceipts: new Set(),
			viewMode: "list",
			sortBy: "date",
			sortOrder: "desc",

			// File management actions
			setFiles: (files) => set({ files }),
			addFiles: (newFiles) =>
				set((state) => ({ files: [...state.files, ...newFiles] })),
			updateFile: (id, updates) =>
				set((state) => ({
					files: state.files.map((file) =>
						file.id === id ? { ...file, ...updates } : file,
					),
				})),
			removeFile: (id) =>
				set((state) => ({
					files: state.files.filter((file) => file.id !== id),
				})),
			clearFiles: () => set({ files: [] }),

			// Expansion and loading state actions
			toggleExpansion: (receiptId) =>
				set((state) => {
					const newExpanded = new Set(state.expandedReceipts);
					if (newExpanded.has(receiptId)) {
						newExpanded.delete(receiptId);
					} else {
						newExpanded.add(receiptId);
					}
					return { expandedReceipts: newExpanded };
				}),

			setExtracting: (receiptId, extracting) =>
				set((state) => {
					const newExtracting = new Set(state.extractingReceipts);
					if (extracting) {
						newExtracting.add(receiptId);
					} else {
						newExtracting.delete(receiptId);
					}
					return { extractingReceipts: newExtracting };
				}),

			setExporting: (receiptId, exporting) =>
				set((state) => {
					const newExporting = new Set(state.exportingReceipts);
					if (exporting) {
						newExporting.add(receiptId);
					} else {
						newExporting.delete(receiptId);
					}
					return { exportingReceipts: newExporting };
				}),

			// View and sorting actions
			setViewMode: (viewMode) => set({ viewMode }),
			setSortBy: (sortBy) => set({ sortBy }),
			setSortOrder: (sortOrder) => set({ sortOrder }),
		}),
		{ name: "receipts-ui-store" },
	),
);

// Main hook that combines UI state
export const useReceipts = () => {
	const uiStore = useReceiptsUIStore();

	// Helper function to create file upload items
	const createFileUploadItems = (fileList: FileList): FileUploadItem[] => {
		const newFiles: FileUploadItem[] = [];

		Array.from(fileList).forEach((file) => {
			// Only accept PDF and image files
			if (!file.type.startsWith("image/") && file.type !== "application/pdf") {
				return;
			}

			const fileItem: FileUploadItem = {
				id: Math.random().toString(36).substr(2, 9),
				name: file.name,
				size: file.size,
				type: file.type,
				status: "uploading",
				progress: 0,
				preview: file.type.startsWith("image/")
					? URL.createObjectURL(file)
					: undefined,
			};

			newFiles.push(fileItem);
		});

		return newFiles;
	};

	// Enhanced file handling
	const handleFiles = (fileList: FileList) => {
		const newFiles = createFileUploadItems(fileList);
		uiStore.addFiles(newFiles);
		return newFiles; // Return so caller can handle upload
	};

	return {
		// UI state
		...uiStore,

		// Enhanced actions
		handleFiles,
		createFileUploadItems,
	};
};
