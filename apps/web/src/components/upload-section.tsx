"use client";

import { Button } from "@fundlevel/ui/components/button";
import { cn } from "@fundlevel/ui/lib/utils";
import { motion } from "framer-motion";
import { AlertCircle, Plus, Upload } from "lucide-react";
import React, { type ComponentPropsWithoutRef, useRef, useState } from "react";

interface UploadSectionProps extends ComponentPropsWithoutRef<"div"> {
	onFilesSelected: (files: FileList) => void;
	maxFiles?: number;
	maxSize?: number; // in bytes
	acceptedTypes?: string[];
	title?: string;
	description?: string;
	supportText?: string;
}

export function UploadSection({
	className,
	onFilesSelected,
	maxFiles = 10,
	maxSize = 10 * 1024 * 1024, // 10MB default
	acceptedTypes = ["application/pdf", "image/jpeg", "image/png", "image/gif"],
	title = "Upload Bank Statements",
	description = "Drag and drop your PDF files or images here, or click to browse",
	supportText = "Supports PDF, JPG, PNG • Files will be processed for transactions",
	...props
}: UploadSectionProps) {
	const [isDragging, setIsDragging] = useState(false);
	const [dragCounter, setDragCounter] = useState(0);
	const [error, setError] = useState<string | null>(null);
	const fileInputRef = useRef<HTMLInputElement>(null);

	const validateFile = (file: File): { isValid: boolean; error?: string } => {
		if (file.size > maxSize) {
			return {
				isValid: false,
				error: `File "${file.name}" is too large. Maximum size is ${formatFileSize(maxSize)}.`,
			};
		}

		const isValidType = acceptedTypes.some((type) => {
			if (type.endsWith("/*")) {
				const category = type.split("/")[0];
				return file.type.startsWith(`${category}/`);
			}
			return file.type === type;
		});

		if (!isValidType) {
			return {
				isValid: false,
				error: `File "${file.name}" is not a supported file type.`,
			};
		}

		return { isValid: true };
	};

	const formatFileSize = (bytes: number): string => {
		if (bytes === 0) return "0 Bytes";
		const k = 1024;
		const sizes = ["Bytes", "KB", "MB", "GB"];
		const i = Math.floor(Math.log(bytes) / Math.log(k));
		return `${Number.parseFloat((bytes / k ** i).toFixed(2))} ${sizes[i]}`;
	};

	const handleFiles = (fileList: FileList) => {
		setError(null);

		if (fileList.length > maxFiles) {
			setError(
				`Maximum ${maxFiles} files allowed. You selected ${fileList.length} files.`,
			);
			return;
		}

		const filesArray = Array.from(fileList);
		const validationResults = filesArray.map(validateFile);
		const invalidFile = validationResults.find((result) => !result.isValid);

		if (invalidFile) {
			setError(invalidFile.error || "Invalid file selected.");
			return;
		}

		onFilesSelected(fileList);
	};

	const handleDrop = (e: React.DragEvent) => {
		e.preventDefault();
		e.stopPropagation();
		setIsDragging(false);
		setDragCounter(0);

		if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
			handleFiles(e.dataTransfer.files);
		}
	};

	const handleDragEnter = (e: React.DragEvent) => {
		e.preventDefault();
		e.stopPropagation();
		setDragCounter((prev) => prev + 1);
		if (e.dataTransfer.items && e.dataTransfer.items.length > 0) {
			setIsDragging(true);
		}
	};

	const handleDragLeave = (e: React.DragEvent) => {
		e.preventDefault();
		e.stopPropagation();
		setDragCounter((prev) => prev - 1);
		if (dragCounter <= 1) {
			setIsDragging(false);
		}
	};

	const handleDragOver = (e: React.DragEvent) => {
		e.preventDefault();
		e.stopPropagation();
	};

	const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
		if (e.target.files && e.target.files.length > 0) {
			handleFiles(e.target.files);
		}
	};

	const clearError = () => {
		setError(null);
	};

	return (
		<div className={cn("mb-8", className)} {...props}>
			{error && (
				<motion.div
					initial={{ opacity: 0, y: -10 }}
					animate={{ opacity: 1, y: 0 }}
					className="mb-4 flex items-start gap-2 rounded-lg border border-destructive/20 bg-destructive/10 p-3"
				>
					<AlertCircle className="mt-0.5 h-4 w-4 flex-shrink-0 text-destructive" />
					<div className="flex-1">
						<p className="text-destructive text-sm">{error}</p>
					</div>
					<Button
						onClick={clearError}
						className="font-medium text-destructive text-sm hover:text-destructive/80"
					>
						×
					</Button>
				</motion.div>
			)}

			<motion.div
				className={cn(
					"relative rounded-xl border-2 border-dashed p-8 text-center transition-all duration-200",
					isDragging
						? "border-muted-foreground bg-muted"
						: "border-border bg-card hover:border-muted-foreground/40",
				)}
				onDrop={handleDrop}
				onDragEnter={handleDragEnter}
				onDragLeave={handleDragLeave}
				onDragOver={handleDragOver}
				whileHover={{ scale: 1.01 }}
				whileTap={{ scale: 0.99 }}
			>
				<input
					ref={fileInputRef}
					type="file"
					multiple
					accept={acceptedTypes.join(",")}
					onChange={handleFileSelect}
					className="hidden"
				/>

				<motion.div
					animate={{ y: isDragging ? -5 : 0 }}
					transition={{ duration: 0.2 }}
				>
					<Upload className="mx-auto mb-4 h-12 w-12 text-muted-foreground" />
					<h3 className="mb-2 font-semibold text-lg">{title}</h3>
					<p className="mb-4 text-muted-foreground">{description}</p>
					<Button onClick={() => fileInputRef.current?.click()}>
						<Plus className="mr-2 h-4 w-4" />
						Choose Files
					</Button>
					<p className="mt-2 text-muted-foreground text-xs">{supportText}</p>
					<p className="mt-1 text-muted-foreground text-xs">
						Max {maxFiles} files • Up to {formatFileSize(maxSize)} each
					</p>
				</motion.div>
			</motion.div>
		</div>
	);
}
