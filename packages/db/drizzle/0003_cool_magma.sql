ALTER TABLE "invoice_transactions" DISABLE ROW LEVEL SECURITY;--> statement-breakpoint
DROP TABLE "invoice_transactions" CASCADE;--> statement-breakpoint
ALTER TABLE "bank_account_transactions" DROP CONSTRAINT "plaid_transactions_check";--> statement-breakpoint
ALTER TABLE "bank_account_transaction_relationships" DROP CONSTRAINT "batr_transaction_id_fkey";
--> statement-breakpoint
ALTER TABLE "bank_account_transactions" DROP CONSTRAINT "plaid_transactions_company_id_fkey";
--> statement-breakpoint
DROP INDEX "batr_unique_transaction_id_idx";--> statement-breakpoint
DROP INDEX "batr_transaction_id_idx";--> statement-breakpoint
DROP INDEX "plaid_transactions_bank_account_id_idx";--> statement-breakpoint
ALTER TABLE "bank_account_transaction_relationships" DROP CONSTRAINT "batr_pkey";--> statement-breakpoint
ALTER TABLE "bank_account_transaction_relationships" ALTER COLUMN "entity_id" SET DATA TYPE text;--> statement-breakpoint
ALTER TABLE "bank_account_transaction_relationships" ADD CONSTRAINT "bank_account_transaction_relationships_bank_account_transaction_id_entity_id_entity_type_pk" PRIMARY KEY("bank_account_transaction_id","entity_id","entity_type");--> statement-breakpoint
ALTER TABLE "bank_account_transaction_relationships" ADD CONSTRAINT "bank_account_transaction_relationships_bank_account_transaction_id_bank_account_transactions_remote_id_fk" FOREIGN KEY ("bank_account_transaction_id") REFERENCES "public"."bank_account_transactions"("remote_id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "bank_account_transactions" ADD CONSTRAINT "bank_account_transactions_company_id_fkey" FOREIGN KEY ("company_id") REFERENCES "public"."companies"("id") ON DELETE cascade ON UPDATE cascade;