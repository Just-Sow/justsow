ALTER TABLE "user" ALTER COLUMN "first_name" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "user" ALTER COLUMN "last_name" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "user" ADD COLUMN "phone_number" text;--> statement-breakpoint
ALTER TABLE "user" ADD COLUMN "two_factor_enabled_at" timestamp with time zone;--> statement-breakpoint
ALTER TABLE "user" ADD COLUMN "password_changed_at" timestamp with time zone;