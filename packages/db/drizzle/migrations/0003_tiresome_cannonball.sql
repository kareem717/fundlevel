ALTER TABLE "bank_statements" RENAME COLUMN "r2_url" TO "s3_key";--> statement-breakpoint
ALTER TABLE "bank_statements" RENAME COLUMN "file_size" TO "file_size_bytes";--> statement-breakpoint
ALTER TABLE "bank_statements" DROP COLUMN "processing_status";