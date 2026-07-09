CREATE TYPE "public"."sower_claim_status" AS ENUM('pending', 'completed', 'rejected', 'expired');--> statement-breakpoint
CREATE TYPE "public"."sower_claim_verification_method" AS ENUM('email_ownership_plus_staff_review');--> statement-breakpoint
CREATE TYPE "public"."sower_profile_source" AS ENUM('staff_manual', 'self_registered', 'imported');--> statement-breakpoint
ALTER TYPE "public"."audit_target_type" ADD VALUE 'sower_profile' BEFORE 'sower_claim';--> statement-breakpoint
CREATE TABLE "sower_claim" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"sower_profile_id" uuid NOT NULL,
	"claimant_user_id" text NOT NULL,
	"status" "sower_claim_status" DEFAULT 'pending' NOT NULL,
	"verification_method" "sower_claim_verification_method" DEFAULT 'email_ownership_plus_staff_review' NOT NULL,
	"requested_at" timestamp with time zone DEFAULT now() NOT NULL,
	"resolved_at" timestamp with time zone,
	"resolved_by_user_id" text,
	"notes" text
);
--> statement-breakpoint
CREATE TABLE "sower_profile" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"display_name" text NOT NULL,
	"contact_email" text,
	"source" "sower_profile_source" DEFAULT 'staff_manual' NOT NULL,
	"notes" text,
	"linked_user_id" text,
	"created_by_user_id" text,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	"claimed_at" timestamp with time zone
);
--> statement-breakpoint
ALTER TABLE "sower_claim" ADD CONSTRAINT "sower_claim_sower_profile_id_sower_profile_id_fk" FOREIGN KEY ("sower_profile_id") REFERENCES "public"."sower_profile"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "sower_claim" ADD CONSTRAINT "sower_claim_claimant_user_id_user_id_fk" FOREIGN KEY ("claimant_user_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "sower_claim" ADD CONSTRAINT "sower_claim_resolved_by_user_id_user_id_fk" FOREIGN KEY ("resolved_by_user_id") REFERENCES "public"."user"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "sower_profile" ADD CONSTRAINT "sower_profile_linked_user_id_user_id_fk" FOREIGN KEY ("linked_user_id") REFERENCES "public"."user"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "sower_profile" ADD CONSTRAINT "sower_profile_created_by_user_id_user_id_fk" FOREIGN KEY ("created_by_user_id") REFERENCES "public"."user"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "sower_claim_sower_profile_id_idx" ON "sower_claim" USING btree ("sower_profile_id");--> statement-breakpoint
CREATE INDEX "sower_claim_claimant_user_id_idx" ON "sower_claim" USING btree ("claimant_user_id");--> statement-breakpoint
CREATE UNIQUE INDEX "sower_claim_pending_by_profile_idx" ON "sower_claim" USING btree ("sower_profile_id") WHERE "sower_claim"."status" = 'pending';--> statement-breakpoint
CREATE UNIQUE INDEX "sower_claim_pending_by_claimant_idx" ON "sower_claim" USING btree ("claimant_user_id") WHERE "sower_claim"."status" = 'pending';--> statement-breakpoint
CREATE UNIQUE INDEX "sower_profile_linked_user_id_idx" ON "sower_profile" USING btree ("linked_user_id") WHERE "sower_profile"."linked_user_id" is not null;--> statement-breakpoint
CREATE INDEX "sower_profile_contact_email_idx" ON "sower_profile" USING btree ("contact_email");--> statement-breakpoint
CREATE INDEX "sower_profile_display_name_idx" ON "sower_profile" USING btree ("display_name");