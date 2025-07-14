"use client";

import { Button } from "@fundlevel/ui/components/button";
import {
	FileUpload,
	FileUploadDropzone,
	FileUploadItem,
	FileUploadItemDelete,
	FileUploadItemMetadata,
	FileUploadItemPreview,
	FileUploadList,
	FileUploadTrigger,
} from "@fundlevel/ui/components/file-upload";
import { cn } from "@fundlevel/ui/lib/utils";
import { orpc } from "@fundlevel/web/lib/orpc/client";
import { useQueryClient } from "@tanstack/react-query";
import { Upload, X } from "lucide-react";
import {
	type ComponentPropsWithoutRef,
	useCallback,
	useMemo,
	useState,
} from "react";
import { toast } from "sonner";

interface BankStatementUploadProps
	extends ComponentPropsWithoutRef<typeof FileUpload> {
	maxSizeBytes?: number;
}

export function BankStatementUpload({
	maxSizeBytes = 2 * 1024 * 1024, // 2MB
	maxFiles = 10,
	accept = "image/png,image/jpeg,application/pdf",
	className,
	...props
}: BankStatementUploadProps) {
	const [files, setFiles] = useState<File[]>([]);
	const queryClient = useQueryClient();

	const acceptedTypes = useMemo(
		() => accept.split(",").map((type) => type.trim().split("/")),
		[accept],
	);
	const maxSizeMB = useMemo(
		() => Math.round(maxSizeBytes / (1024 * 1024)),
		[maxSizeBytes],
	);

	const onFileValidate = useCallback(
		(file: File): string | null => {
			// Validate max files
			if (files.length >= maxFiles) {
				return `You can only upload up to ${maxFiles} files`;
			}

			// Validate file type
			const isAccepted = acceptedTypes.some(([prefix, suffix]) => {
				if (suffix === "*") {
					return file.name.startsWith(prefix);
				}

				return file.type === `${prefix}/${suffix}`;
			});

			if (!isAccepted) {
				return `${file.type.split("/")[1].toUpperCase()} files are not allowed`;
			}

			// Validate file size (max 2MB)
			if (file.size > maxSizeBytes) {
				return `File size must be less than ${maxSizeMB}MB`;
			}

			return null;
		},
		[files, maxFiles, maxSizeBytes, acceptedTypes, maxSizeMB],
	);

	const onFileReject = useCallback((file: File, message: string) => {
		toast(message, {
			description: `"${file.name.length > 20 ? `${file.name.slice(0, 20)}...` : file.name}" has been rejected`,
		});
	}, []);

	const onUpload = async (
		files: File[],
		{
			onSuccess,
		}: {
			onProgress: (file: File, progress: number) => void;
			onSuccess: (file: File) => void;
			onError: (file: File, error: Error) => void;
		},
	) => {
		try {
			// Process each file individually
			const uploadPromises = files.map(async (file) => {
				try {
					await orpc.bankStatement.upload.call({
						file,
					});

					onSuccess(file);
				} catch (error) {
					toast.error(`Failed to upload ${file.name}`, {
						description:
							error instanceof Error ? error.message : "Unknown error",
					});
				}
			});

			// Wait for all uploads to complete
			await toast.promise(Promise.all(uploadPromises), {
				loading: `Uploading ${files.length} files...`,
				success: `${files.length} files uploaded successfully`,
				error: `Failed to upload ${files.length} files`,
			});

			//TODO: fix this, it's not invalidating the query
			await queryClient.invalidateQueries({
				queryKey: orpc.bankStatement.list.key(),
			});
		} catch (error) {
			// This handles any error that might occur outside the individual upload processes
			console.error("Unexpected error during upload:", error);
		}
	};

	return (
		<FileUpload
			value={files}
			onValueChange={setFiles}
			onFileValidate={onFileValidate}
			onFileReject={onFileReject}
			onUpload={onUpload}
			maxFiles={maxFiles}
			multiple
			accept={accept}
			{...props}
			className={cn("mx-auto max-w-4/5", className)}
		>
			<FileUploadDropzone>
				<div className="flex flex-col items-center gap-1">
					<div className="flex items-center justify-center rounded-full border p-2.5">
						<Upload className="size-6 text-muted-foreground" />
					</div>
					<p className="font-medium text-sm">Drag & drop files here</p>
					<p className="text-muted-foreground text-xs">Or click to browse</p>
				</div>
				<FileUploadTrigger asChild>
					<Button variant="outline" size="sm" className="mt-2 w-fit">
						Browse files
					</Button>
				</FileUploadTrigger>
			</FileUploadDropzone>
			<FileUploadList>
				{files.map((file) => (
					<FileUploadItem key={file.name} value={file}>
						<FileUploadItemPreview />
						<FileUploadItemMetadata />
						<FileUploadItemDelete asChild>
							<Button variant="ghost" size="icon" className="size-7">
								<X />
							</Button>
						</FileUploadItemDelete>
					</FileUploadItem>
				))}
			</FileUploadList>
		</FileUpload>
	);
}
