CREATE TABLE "bank_statements" (
	"id" serial PRIMARY KEY NOT NULL,
	"original_file_name" text NOT NULL,
	"r2_url" text NOT NULL,
	"file_type" varchar(50) NOT NULL,
	"file_size" text NOT NULL,
	"user_id" text NOT NULL,
	"processing_status" varchar(20) DEFAULT 'pending' NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "nango_connections" (
	"id" text PRIMARY KEY NOT NULL,
	"provider" text NOT NULL,
	"user_id" text NOT NULL,
	"provider_config_key" text NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone NOT NULL
);
--> statement-breakpoint
CREATE TABLE "transactions" (
	"id" serial PRIMARY KEY NOT NULL,
	"amount_cents" integer NOT NULL,
	"date" date NOT NULL,
	"description" text NOT NULL,
	"merchant" text NOT NULL,
	"currency" varchar(3),
	"user_id" text NOT NULL,
	"bank_statement_id" integer NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "transactions" ADD CONSTRAINT "transactions_bank_statement_id_bank_statements_id_fk" FOREIGN KEY ("bank_statement_id") REFERENCES "public"."bank_statements"("id") ON DELETE cascade ON UPDATE cascade;