"use client";

import { Button } from "@fundlevel/ui/components/button";
import { motion } from "framer-motion";
import {
	AlertCircle,
	CheckCircle,
	Clock,
	FileText,
	Image as ImageIcon,
	Trash2,
} from "lucide-react";
import Image from "next/image";
import type { ComponentPropsWithoutRef } from "react";
import type { FileUploadItem } from "./types";

interface UploadFileItemProps
	extends ComponentPropsWithoutRef<typeof motion.div> {
	file: FileUploadItem;
	onRemove: (id: string) => void;
}

const formatFileSize = (bytes: number): string => {
	if (bytes === 0) return "0 Bytes";
	const k = 1024;
	const sizes = ["Bytes", "KB", "MB", "GB"];
	const i = Math.floor(Math.log(bytes) / Math.log(k));
	return `${Number.parseFloat((bytes / k ** i).toFixed(2))} ${sizes[i]}`;
};

const getFileIcon = (type: string) => {
	if (type.startsWith("image/")) return ImageIcon;
	if (type === "application/pdf") return FileText;
	return FileText;
};

export function UploadFileItem({
	className,
	file,
	onRemove,
	...props
}: UploadFileItemProps) {
	const IconComponent = getFileIcon(file.type);

	return (
		<motion.div
			initial={{ opacity: 0, y: 20 }}
			animate={{ opacity: 1, y: 0 }}
			exit={{ opacity: 0, y: -20 }}
			className={`px-6 py-4 transition-colors hover:bg-muted/50 ${className || ""}`}
			{...props}
		>
			<div className="flex items-center space-x-4">
				{/* File Icon/Preview */}
				<div className="flex-shrink-0">
					{file.preview ? (
						<Image
							src={file.preview}
							alt={file.name}
							className="h-10 w-10 rounded-lg object-cover"
						/>
					) : (
						<div className="flex h-10 w-10 items-center justify-center rounded-lg bg-muted">
							<IconComponent className="h-5 w-5 text-muted-foreground" />
						</div>
					)}
				</div>

				{/* File Info */}
				<div className="min-w-0 flex-1">
					<div className="flex items-center space-x-2">
						<p className="truncate font-medium text-sm">{file.name}</p>
						{file.status === "completed" && (
							<CheckCircle className="h-4 w-4 text-green-500" />
						)}
						{file.status === "error" && (
							<AlertCircle className="h-4 w-4 text-destructive" />
						)}
					</div>
					<div className="mt-1 flex items-center space-x-4">
						<p className="text-muted-foreground text-xs">
							{formatFileSize(file.size)}
						</p>
						{file.uploadedAt && (
							<p className="flex items-center text-muted-foreground text-xs">
								<Clock className="mr-1 h-3 w-3" />
								{file.uploadedAt.toLocaleTimeString()}
							</p>
						)}
					</div>

					{/* Progress Bar */}
					{file.status === "uploading" && (
						<div className="mt-2">
							<div className="mb-1 flex items-center justify-between text-muted-foreground text-xs">
								<span>Processing...</span>
								<span>{Math.round(file.progress)}%</span>
							</div>
							<div className="h-1.5 w-full rounded-full bg-muted">
								<motion.div
									className="h-1.5 rounded-full bg-primary"
									initial={{ width: 0 }}
									animate={{ width: `${file.progress}%` }}
									transition={{ duration: 0.3 }}
								/>
							</div>
						</div>
					)}

					{/* Error Message */}
					{file.status === "error" && file.error && (
						<p className="mt-1 text-destructive text-xs">{file.error}</p>
					)}
				</div>

				{/* Actions */}
				<div className="flex items-center space-x-2">
					<Button
						onClick={() => onRemove(file.id)}
						className="rounded-lg p-2 text-muted-foreground hover:bg-muted hover:text-destructive"
					>
						<Trash2 className="h-4 w-4" />
					</Button>
				</div>
			</div>
		</motion.div>
	);
}
