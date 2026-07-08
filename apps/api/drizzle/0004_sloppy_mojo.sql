ALTER TABLE "user" ADD COLUMN "first_name" text;--> statement-breakpoint
ALTER TABLE "user" ADD COLUMN "last_name" text;--> statement-breakpoint
UPDATE "user"
SET
  "first_name" = COALESCE(
    NULLIF(split_part(trim(COALESCE("name", '')), ' ', 1), ''),
    NULLIF(split_part("email", '@', 1), ''),
    'Account'
  ),
  "last_name" = COALESCE(
    NULLIF(regexp_replace(trim(COALESCE("name", '')), '^\S+\s*', ''), ''),
    'User'
  );--> statement-breakpoint
ALTER TABLE "user" ALTER COLUMN "first_name" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "user" ALTER COLUMN "last_name" SET NOT NULL;
