"use client";

import { Button } from "@fundlevel/ui/components/button";
import { motion } from "framer-motion";
import { Plus, Upload } from "lucide-react";
import React, { type ComponentPropsWithoutRef, useRef, useState } from "react";

interface UploadSectionProps extends ComponentPropsWithoutRef<"div"> {
	onFilesSelected: (files: FileList) => void;
}

export function UploadSection({
	className,
	onFilesSelected,
	...props
}: UploadSectionProps) {
	const [isDragging, setIsDragging] = useState(false);
	const fileInputRef = useRef<HTMLInputElement>(null);

	const handleDrop = (e: React.DragEvent) => {
		e.preventDefault();
		setIsDragging(false);
		onFilesSelected(e.dataTransfer.files);
	};

	const handleDragOver = (e: React.DragEvent) => {
		e.preventDefault();
		setIsDragging(true);
	};

	const handleDragLeave = () => {
		setIsDragging(false);
	};

	const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
		if (e.target.files) {
			onFilesSelected(e.target.files);
		}
	};

	return (
		<div className={`mb-8 ${className || ""}`} {...props}>
			<motion.div
				className={`relative rounded-xl border-2 border-dashed p-8 text-center transition-all duration-200 ${
					isDragging
						? "border-muted-foreground bg-muted"
						: "border-border bg-card hover:border-muted-foreground/40"
				}`}
				onDrop={handleDrop}
				onDragOver={handleDragOver}
				onDragLeave={handleDragLeave}
				whileHover={{ scale: 1.01 }}
				whileTap={{ scale: 0.99 }}
			>
				<input
					ref={fileInputRef}
					type="file"
					multiple
					accept="application/pdf,image/jpeg,image/png,image/gif"
					onChange={handleFileSelect}
					className="hidden"
				/>

				<motion.div
					animate={{ y: isDragging ? -5 : 0 }}
					transition={{ duration: 0.2 }}
				>
					<Upload className="mx-auto mb-4 h-12 w-12 text-muted-foreground" />
					<h3 className="mb-2 font-semibold text-lg">Upload Bank Statements</h3>
					<p className="mb-4 text-muted-foreground">
						Drag and drop your PDF files or images here, or click to browse
					</p>
					<Button onClick={() => fileInputRef.current?.click()}>
						<Plus className="mr-2 h-4 w-4" />
						Choose Files
					</Button>
					<p className="mt-2 text-muted-foreground text-xs">
						Supports PDF, JPG, PNG • Files will be processed for transactions
					</p>
				</motion.div>
			</motion.div>
		</div>
	);
}
