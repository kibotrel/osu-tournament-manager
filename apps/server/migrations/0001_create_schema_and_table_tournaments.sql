CREATE SCHEMA "tournaments";
--> statement-breakpoint
DO $$ BEGIN
  CREATE TYPE "tournaments"."scoreMode" AS ENUM('accuracy', 'combo', 'score', 'scoreV2');
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
  CREATE TYPE "tournaments"."teamMode" AS ENUM('headToHead', 'tagCoOp', 'tagTeamVs', 'teamVs');
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "tournaments"."tournaments" (
	"acronym" varchar(32) NOT NULL,
	"createdAt" timestamp DEFAULT now() NOT NULL,
	"endsAt" timestamp,
	"id" serial PRIMARY KEY NOT NULL,
	"includesQualifierStage" boolean NOT NULL,
	"name" varchar(256) NOT NULL,
	"scoreMode" "tournaments"."scoreMode" NOT NULL,
	"startsAt" timestamp NOT NULL,
	"teamMode" "tournaments"."teamMode" NOT NULL,
	"updatedAt" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
DO $$ BEGIN
  ALTER TABLE "tournaments"."tournaments" ADD CONSTRAINT "endsAt_date_check" CHECK ("endsAt" > "startsAt");
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;
