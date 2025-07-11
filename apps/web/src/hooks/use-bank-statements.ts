"use client";

import { create } from "zustand";
import { devtools } from "zustand/middleware";
import type {
	FileUploadItem,
	SortBy,
	SortOrder,
	ViewMode,
} from "@/app/(dashboard)/bank-statements/components/types";

interface BankStatementsUIState {
	// UI State only
	files: FileUploadItem[];
	expandedStatements: Set<number>;
	extractingStatements: Set<number>;
	exportingStatements: Set<number>;
	viewMode: ViewMode;
	sortBy: SortBy;
	sortOrder: SortOrder;

	// UI Actions
	setFiles: (files: FileUploadItem[]) => void;
	addFiles: (files: FileUploadItem[]) => void;
	updateFile: (id: string, updates: Partial<FileUploadItem>) => void;
	removeFile: (id: string) => void;
	clearFiles: () => void;

	toggleExpansion: (statementId: number) => void;
	setExtracting: (statementId: number, extracting: boolean) => void;
	setExporting: (statementId: number, exporting: boolean) => void;

	setViewMode: (mode: ViewMode) => void;
	setSortBy: (sortBy: SortBy) => void;
	setSortOrder: (order: SortOrder) => void;
}

export const useBankStatementsUIStore = create<BankStatementsUIState>()(
	devtools(
		(set, get) => ({
			// Initial state
			files: [],
			expandedStatements: new Set(),
			extractingStatements: new Set(),
			exportingStatements: new Set(),
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
			toggleExpansion: (statementId) =>
				set((state) => {
					const newExpanded = new Set(state.expandedStatements);
					if (newExpanded.has(statementId)) {
						newExpanded.delete(statementId);
					} else {
						newExpanded.add(statementId);
					}
					return { expandedStatements: newExpanded };
				}),

			setExtracting: (statementId, extracting) =>
				set((state) => {
					const newExtracting = new Set(state.extractingStatements);
					if (extracting) {
						newExtracting.add(statementId);
					} else {
						newExtracting.delete(statementId);
					}
					return { extractingStatements: newExtracting };
				}),

			setExporting: (statementId, exporting) =>
				set((state) => {
					const newExporting = new Set(state.exportingStatements);
					if (exporting) {
						newExporting.add(statementId);
					} else {
						newExporting.delete(statementId);
					}
					return { exportingStatements: newExporting };
				}),

			// View and sorting actions
			setViewMode: (viewMode) => set({ viewMode }),
			setSortBy: (sortBy) => set({ sortBy }),
			setSortOrder: (sortOrder) => set({ sortOrder }),
		}),
		{ name: "bank-statements-ui-store" },
	),
);

// Main hook that combines UI state with React Query
export const useBankStatements = () => {
	const uiStore = useBankStatementsUIStore();

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
