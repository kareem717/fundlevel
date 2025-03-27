CREATE TYPE "public"."data_provider" AS ENUM('quickbooks', 'plaid');--> statement-breakpoint
ALTER TABLE "quick_books_invoices" RENAME TO "invoices";--> statement-breakpoint
ALTER TABLE "invoices" DROP CONSTRAINT "quick_books_invoices_remote_id_key";--> statement-breakpoint
ALTER TABLE "transaction_relationships" DROP CONSTRAINT "transaction_relationships_invoice_id_quick_books_invoices_id_fk";
--> statement-breakpoint
ALTER TABLE "invoice_lines" DROP CONSTRAINT "invoice_lines_invoice_id_quick_books_invoices_id_fk";
--> statement-breakpoint
ALTER TABLE "invoices" DROP CONSTRAINT "quick_books_invoices_company_id_fkey";
--> statement-breakpoint
ALTER TABLE "invoices" ADD COLUMN "data_provider" "data_provider" NOT NULL;--> statement-breakpoint
ALTER TABLE "transaction_relationships" ADD CONSTRAINT "transaction_relationships_invoice_id_invoices_id_fk" FOREIGN KEY ("invoice_id") REFERENCES "public"."invoices"("id") ON DELETE cascade ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE "invoice_lines" ADD CONSTRAINT "invoice_lines_invoice_id_invoices_id_fk" FOREIGN KEY ("invoice_id") REFERENCES "public"."invoices"("id") ON DELETE cascade ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE "invoices" ADD CONSTRAINT "invoices_company_id_fkey" FOREIGN KEY ("company_id") REFERENCES "public"."companies"("id") ON DELETE cascade ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE "invoices" ADD CONSTRAINT "invoices_remote_id_key" UNIQUE("remote_id");