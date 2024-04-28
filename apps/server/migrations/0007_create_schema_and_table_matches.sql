CREATE SCHEMA "matches";
--> statement-breakpoint
DO $$ BEGIN
  CREATE TYPE "matches"."draftType" AS ENUM('ban', 'pick', 'protect');
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "matches"."matches" (
	"bansPerTeam" integer NOT NULL,
	"bestOf" smallint NOT NULL,
	"createdAt" timestamp DEFAULT now() NOT NULL,
	"endsAt" timestamp,
	"gameMatchId" integer NOT NULL,
	"id" serial PRIMARY KEY NOT NULL,
	"isQualifierMatch" boolean NOT NULL,
	"mappoolId" integer NOT NULL,
	"name" varchar NOT NULL,
	"protectsPerTeam" integer NOT NULL,
	"startsAt" timestamp,
	"tournamentId" integer NOT NULL,
	"updatedAt" timestamp DEFAULT now() NOT NULL,
	"winnerTournamentTeamId" integer,
	CONSTRAINT "matches_gameMatchId_unique" UNIQUE("gameMatchId")
);
--> statement-breakpoint
DO $$ BEGIN
  ALTER TABLE "matches"."matches" ADD CONSTRAINT "matches_mappoolId_mappools_id_fk" FOREIGN KEY ("mappoolId") REFERENCES "mappools"."mappools"("id") ON DELETE restrict ON UPDATE no action;
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
  ALTER TABLE "matches"."matches" ADD CONSTRAINT "matches_tournamentId_tournaments_id_fk" FOREIGN KEY ("tournamentId") REFERENCES "tournaments"."tournaments"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
  ALTER TABLE "matches"."matches" ADD CONSTRAINT "matches_winnerTournamentTeamId_teams_id_fk" FOREIGN KEY ("winnerTournamentTeamId") REFERENCES "tournaments"."teams"("id") ON DELETE restrict ON UPDATE no action;
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
  ALTER TABLE "matches"."matches" ADD CONSTRAINT "endsAt_date_check" CHECK ("endsAt" > "startsAt");
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;
