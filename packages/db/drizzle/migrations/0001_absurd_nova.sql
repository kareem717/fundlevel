CREATE TABLE "receipt_items" (
	"id" serial PRIMARY KEY NOT NULL,
	"receipt_id" integer NOT NULL,
	"user_id" text NOT NULL,
	"name" text NOT NULL,
	"quantity" numeric(10, 3) NOT NULL,
	"unit_price_cents" integer NOT NULL,
	"total_price_cents" integer NOT NULL,
	"category" text,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "receipts" (
	"id" serial PRIMARY KEY NOT NULL,
	"original_file_name" text NOT NULL,
	"r2_url" text NOT NULL,
	"file_type" varchar(50) NOT NULL,
	"file_size" text NOT NULL,
	"user_id" text NOT NULL,
	"processing_status" varchar(20) DEFAULT 'pending' NOT NULL,
	"merchant_name" text,
	"receipt_date" date,
	"total_amount_cents" integer,
	"tax_amount_cents" integer,
	"currency" varchar(3) DEFAULT 'USD',
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "receipt_items" ADD CONSTRAINT "receipt_items_receipt_id_receipts_id_fk" FOREIGN KEY ("receipt_id") REFERENCES "public"."receipts"("id") ON DELETE cascade ON UPDATE cascade;