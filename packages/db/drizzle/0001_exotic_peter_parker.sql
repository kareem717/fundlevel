CREATE TYPE "public"."bank_account_transaction_relationship_entity_type" AS ENUM('invoice');--> statement-breakpoint
CREATE TABLE "bank_account_transaction_relationships" (
	"bank_account_transaction_id" text NOT NULL,
	"entity_id" integer NOT NULL,
	"entity_type" "bank_account_transaction_relationship_entity_type" NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone,
	CONSTRAINT "batr_pkey" PRIMARY KEY("bank_account_transaction_id","entity_id","entity_type")
);
--> statement-breakpoint
ALTER TABLE "bank_account_transaction_relationships" ADD CONSTRAINT "bank_account_transaction_relationships_bank_account_transaction_id_bank_account_transactions_remote_id_fk" FOREIGN KEY ("bank_account_transaction_id") REFERENCES "public"."bank_account_transactions"("remote_id") ON DELETE cascade ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE "bank_account_transaction_relationships" ADD CONSTRAINT "batr_transaction_id_fkey" FOREIGN KEY ("bank_account_transaction_id") REFERENCES "public"."bank_account_transactions"("remote_id") ON DELETE cascade ON UPDATE cascade;--> statement-breakpoint
CREATE UNIQUE INDEX "batr_unique_transaction_id_idx" ON "bank_account_transaction_relationships" USING btree ("bank_account_transaction_id");--> statement-breakpoint
CREATE INDEX "batr_transaction_id_idx" ON "bank_account_transaction_relationships" USING btree ("bank_account_transaction_id");