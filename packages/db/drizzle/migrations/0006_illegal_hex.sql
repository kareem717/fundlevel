ALTER TABLE "bank_statements" ADD COLUMN "extraction_job_id" text;--> statement-breakpoint
ALTER TABLE "bank_statements" DROP COLUMN "status";