ALTER TABLE "bank_statements" ALTER COLUMN "file_type" SET DATA TYPE text;--> statement-breakpoint
ALTER TABLE "bank_statements" ALTER COLUMN "created_at" SET DATA TYPE timestamp;--> statement-breakpoint
ALTER TABLE "bank_statements" ALTER COLUMN "created_at" SET DEFAULT now();--> statement-breakpoint
ALTER TABLE "bank_statements" ALTER COLUMN "updated_at" SET DATA TYPE timestamp;--> statement-breakpoint
ALTER TABLE "bank_statements" ALTER COLUMN "updated_at" SET DEFAULT now();--> statement-breakpoint
ALTER TABLE "bank_statements" ADD COLUMN "status" text DEFAULT 'pending' NOT NULL;--> statement-breakpoint
ALTER TABLE "bank_statements" ADD COLUMN "extraction_job_id" text;