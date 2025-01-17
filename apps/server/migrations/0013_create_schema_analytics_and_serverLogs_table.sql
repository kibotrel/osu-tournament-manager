CREATE SCHEMA "analytics";
--> statement-breakpoint
DO $$ BEGIN
 CREATE TYPE "analytics"."logLevel" AS ENUM('debug', 'error', 'http', 'info', 'silly', 'verbose', 'warn');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "analytics"."serverLogs" (
	"createdAt" timestamp DEFAULT now() NOT NULL,
	"id" serial PRIMARY KEY NOT NULL,
	"level" "analytics"."logLevel" NOT NULL,
	"message" text NOT NULL,
	"metadata" json,
	"requestId" uuid NOT NULL,
	"timestamp" timestamp NOT NULL,
	"updatedAt" timestamp DEFAULT now() NOT NULL
);
