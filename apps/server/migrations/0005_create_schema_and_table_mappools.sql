CREATE SCHEMA "mappools";
--> statement-breakpoint
DO $$ BEGIN
  CREATE TYPE "mappools"."gameMode" AS ENUM('catch', 'mania', 'standard', 'taiko');
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "mappools"."mappools" (
	"createdAt" timestamp DEFAULT now() NOT NULL,
	"id" serial PRIMARY KEY NOT NULL,
	"name" varchar(128) NOT NULL,
	"tournamentId" integer NOT NULL,
	"updatedAt" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
DO $$ BEGIN
  ALTER TABLE "mappools"."mappools" ADD CONSTRAINT "mappools_tournamentId_tournaments_id_fk" FOREIGN KEY ("tournamentId") REFERENCES "tournaments"."tournaments"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;
