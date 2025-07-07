CREATE TABLE "transactions" (
	"id" serial PRIMARY KEY NOT NULL,
	"amount_cents" integer NOT NULL,
	"date" date NOT NULL,
	"description" text NOT NULL,
	"merchant" text NOT NULL,
	"currency" varchar(3),
	"user_id" integer NOT NULL,
	"source_file_url" text NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone NOT NULL
);
--> statement-breakpoint
ALTER TABLE "transactions" ADD CONSTRAINT "transactions_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;