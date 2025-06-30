CREATE TABLE "bill_lines" (
	"id" serial PRIMARY KEY NOT NULL,
	"bill_id" integer NOT NULL,
	"remote_id" text NOT NULL,
	"amount" double precision NOT NULL,
	"description" text,
	"remaining_remote_content" jsonb NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone,
	CONSTRAINT "bill_lines_remote_id_unique" UNIQUE("remote_id")
);
--> statement-breakpoint
CREATE TABLE "bills" (
	"id" serial PRIMARY KEY NOT NULL,
	"company_id" integer NOT NULL,
	"remote_id" text NOT NULL,
	"sync_token" text NOT NULL,
	"vendor_name" text,
	"currency" varchar(3),
	"transaction_date" date,
	"total_amount" double precision,
	"remaining_remote_content" jsonb NOT NULL,
	"due_date" date,
	"remaining_balance" double precision,
	"data_provider" "data_provider" NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone,
	CONSTRAINT "bills_remote_id_unique" UNIQUE("remote_id")
);
--> statement-breakpoint
ALTER TABLE "bill_lines" ADD CONSTRAINT "bill_lines_bill_id_bills_id_fk" FOREIGN KEY ("bill_id") REFERENCES "public"."bills"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "bills" ADD CONSTRAINT "bills_company_id_companies_id_fk" FOREIGN KEY ("company_id") REFERENCES "public"."companies"("id") ON DELETE no action ON UPDATE no action;